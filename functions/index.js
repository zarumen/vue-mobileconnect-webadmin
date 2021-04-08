const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { BigQuery } = require('@google-cloud/bigquery');
admin.initializeApp();

const rp = require('request-promise');

const request = rp.defaults({ simple : false });
const LINE_ACCESS_TOKEN = functions.config().line.grouptoken;
const projectId = functions.config().mobileconnect.id;

// const conf = require('./key.json');

// if(Object.keys(functions.config().service_account).length) {
//   conf = functions.config().service_account
// }

const bigquery = new BigQuery({
  projectId,
  keyFilename: functions.config().service_account
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send('Hello from Firebase!');
// });

exports.aggregateOperatorInShortcodeConfig = functions.firestore
  .document('shortcodeConfig/{ShortcodeId}/operator/{operatorId}')
  .onWrite((change, context) => {
    // const txId = context.params.txId;
    const id = context.params.ShortcodeId;
    
    // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
    const document = change.after.exists ? change.after.data() : null;

    // ref to the parent document
    const docRef = admin
      .firestore()
      .collection('shortcodeConfig')
      .doc(id);

    // get all comments and aggregate
    return docRef
      .collection('operator')
      .get()
      .then(querySnapshot => {
        // get the total comment count
        const operatorCount = querySnapshot.size;

        const operatorName = [];
        let recentTransactions = [];

        // add data from the 5 most recent comments to the array
        querySnapshot.forEach(doc => {
          operatorName.push(doc.id);
          recentTransactions.push(doc.data());
        });

        let shortcodeType = [];

        if (document) {

          let opsAll = recentTransactions.map(ops => ops.type);
          shortcodeType = [...new Set(opsAll)];

        }


        // data to update on the document
        const data = {
          operatorCount,
          operatorName,
          shortcodeType
        };

        // run update
        return docRef.update(data);
      })
      .catch(err => console.log(err));
  });

exports.deleteAggregationInShortcodeConfig = functions.firestore
  .document('shortcodeConfig/{ShortcodeId}/operator/{operatorId}')
  .onDelete((snap, context) => {

    const id = context.params.ShortcodeId;

    const docRef = admin
      .firestore()
      .collection('shortcodeConfig')
      .doc(id);

    const deletedValue = snap.data();

    return docRef
      .collection('operator')
      .get()
      .then(querySnapshot => {
        const operatorCount = querySnapshot.size;

        const operatorName = [];
        let recentTransactions = [];

        // add data from the 5 most recent comments to the array
        querySnapshot.forEach(doc => {
          operatorName.push(doc.id);
          recentTransactions.push(doc.data());
        });

        let shortcodeType = [];

        if (deletedValue) {

          let opsAll = recentTransactions.map(ops => ops.type);
          shortcodeType = [...new Set(opsAll)];

        }


        // data to update on the document
        const data = {
          operatorCount,
          operatorName,
          shortcodeType
        };

        // run update
        return docRef.update(data);
      })
      .catch(err => console.log(err));
  });

exports.aggregationInExportJobs = functions.firestore
  .document('exportJobs/{campaignId}/jobs/{jobId}')
  .onWrite((change, context) => {

    const id = context.params.campaignId;

    // const document = change.after.exists ? change.after.data() : null;

    const jobRef = admin
      .firestore()
      .collection('exportJobs')
      .doc(id);

    return jobRef
      .collection('jobs')
      .orderBy('createTime', 'desc')
      .get()
      .then(querySnapshot => {

        let jobsCount = querySnapshot.size;
        let allJobs = [];
        let recentJobs = [];

        // add data from the 5 most recent comments to the array
        querySnapshot.forEach(doc => {
          allJobs.push(doc.data());
        });

        recentJobs = allJobs.slice(0, 3);



        // data to update on the document
        let data = {
          jobsCount,
          recentJobs
        };

        // run update
        return jobRef.update(data);
      })
      .catch(err => console.log(err));
  });

exports.everyFiveMinuteJob = functions.pubsub
  .schedule('00 5 * * *').onRun(async context => {

      // Consistent timestamp
  const now = admin.firestore.Timestamp.now();

  function formatDate(date) {
    let t = new Date(1970, 0, 1, 7, 0)
    // date = parseDate(date)
    t.setSeconds(date)
    return t
  };

  const queryTestState = admin
    .firestore()
    .collection('campaignValidate')
    .where('campaignState', '==', 'test')
    .where('campaignDateTestEnd', '>', now)

  const queryProductionState = admin
    .firestore()
    .collection('campaignValidate')
    .where('campaignState', '==', 'production')
    .where('campaignDateStart', '>', now)

  const tasks = await queryTestState.get();
  const tasks2 = await queryProductionState.get();

  // Jobs to execute concurrently. 
  const jobsTest = [];
  const jobsProduction = [];

  tasks.forEach(snapshot => {
    let item;

    let t = `${formatDate(snapshot.data().campaignDateStart.seconds)}`;
    let c = t.slice(0,15);

    item = `ID:'${snapshot.id}' => ${c} \r\n`;
    
    jobsTest.push(item);
    
  });

  tasks2.forEach(snapshot => {

    let item;
    let t = `${formatDate(snapshot.data().campaignDateStart.seconds)}`;
    let a = t.slice(0,15);
    
    item = `ID:'${snapshot.id}' => ${a} \r\n`;
    
    jobsProduction.push(item);
    
  });
  let nowText = `${formatDate(now.seconds)}`;
  let nowDate = nowText.slice(0,15);

  let testCamp = jobsTest.reduce((x, y) => x + y);
  
  let proCamp = ''
  if(jobsProduction.length > 0) {
    // check next production campaign > 0
    proCamp = jobsProduction.reduce((x, y) => x + y);
  }

  const finalMessage = `${nowDate}\r\nWARNING!!!! \r\nTEST CAMPAIGNS (${jobsTest.length}):\r\n${testCamp}\r\nPRODUCTION FUTURE CAMPAIGNS (${jobsProduction.length}):\r\n${proCamp}`;

    request ({
          uri: 'https://notify-api.line.me/api/notify',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www- form-urlencoded', 
            'Authorization':  `Bearer ${LINE_ACCESS_TOKEN}`
          },
          form: {
            'message': finalMessage
          }
        }).then((response) => {
          console.log('User HAS% d repos', response.length);
          console.log('response:', response);
          return response.status;
        }).catch (err => console.log(err));
  });

exports.deleteUserFromAuth = functions.firestore
  .document('users/{userId}')
  .onDelete((snap, context) => {

    const uId = context.params.userId;

    admin.auth().deleteUser(uId)
      .then(function() {
        console.log('Successfully deleted user');
      })
      .catch(function(error) {
        console.log('Error deleting user:', error);
      });
  });

exports.syncDateTime = functions.firestore
  .document('campaignValidate/{campaignId}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property
    const id = context.params.campaignId;
    const startDate = newValue.campaignDateStart;
    const endDate = newValue.campaignDateEnd;

    const docRef = admin
    .firestore()
    .collection('campaigns')
    .doc(id);

    // perform desired operations ...
    const data = {
      campaignDateStart: startDate,
      campaignDateEnd: endDate
    };

    return docRef.update(data);
  });

exports.addCampaignIdToValidate = functions.firestore
  .document('campaignValidate/{campaignId}')
  .onWrite((change, context) => {

    const id = context.params.campaignId;

    const docRef = admin
      .firestore()
      .collection('campaignValidate')
      .doc(id);

    const data = {
      campaignId: id
    };

    return docRef.set(data, { merge: true });

  });

exports.exportTxFromBigquery = functions.runWith({ memory: '1GB' }).pubsub
  .schedule('00 11 * * *').onRun(async context => {


    const sqlQuery = `
    SELECT shortcode, campaignID, campaignName, count( shortcode ) AS Total, CAST(FORMAT_DATE('%Y%m%d000000', current_date) as INT64) as today, CAST(FORMAT_DATE('%Y%m%d000000', DATE_SUB(current_date, INTERVAL 1 DAY)) as INT64) as yesterday
    FROM \`mobile-connect-sms.2waysms.2waysms_transaction_status\`
    WHERE createDateTime > CAST(FORMAT_DATE('%Y%m%d000000', DATE_SUB(current_date, INTERVAL 1 DAY)) as INT64) and createDateTime < CAST(FORMAT_DATE('%Y%m%d000000', current_date) as INT64) and operator!='testweb' and campaignID != ' '
    group by shortcode, campaignID, campaignName
    order by shortcode
    `;

    // const jobRun = bigquery.job('bquxjob_65760a09_16d59030bf2');

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: sqlQuery,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
      useLegacySql: false
    };
    let job;
    let rows;

    try {
      const result = await new Promise((resolve, reject) => {
        bigquery
          .createQueryJob(options)
          .then(results => {
            job = results[0];
            console.log(`Job ${job.id} started.`);
            return job.promise();
          })
          .then(() =>
            // Get the job's status
            job.getMetadata()
          )
          .then(metadata => {
            // Check the job's status for errors
            const errors = metadata[0].status.errors;
            if (errors && errors.length > 0) {
              throw errors;
            }
          })
          .then(() => {
            console.log(`Job ${job.id} completed.`);
            return job.getQueryResults();
          })
          .then(results => {
            rows = results[0];
            let array = []
            rows.forEach(row => {
              array.push(row)
            });
            resolve(rows);
          })
          .catch(err => {
            reject(err);
          });
      });
      
      console.log(`return Promise: ${JSON.stringify(result)}`)
      return result;
    } catch (error) {
      throw new Error(error);
    }
  });