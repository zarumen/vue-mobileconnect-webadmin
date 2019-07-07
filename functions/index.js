const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

const rp = require('request-promise');

const request = rp.defaults({ simple : false });
const LINE_ACCESS_TOKEN = "zMsztWI7Jd20mx7nlDkdwPoaronXSFEf56WQRSSaF7A";
const ONE_ONE_TOKEN = "7dZINoNtAYWQyaYmnsNCsaNzC9yGJbicmF2lzjjXITp";

// admin.firestore().settings();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.aggregateOperatorInShortcodeConfig = functions.firestore
  .document("shortcodeConfig/{ShortcodeId}/operator/{operatorId}")
  .onWrite((change, context) => {
    // const txId = context.params.txId;
    const id = context.params.ShortcodeId;
    
    const document = change.after.exists ? change.after.data() : null;

    // ref to the parent document
    const docRef = admin
      .firestore()
      .collection("shortcodeConfig")
      .doc(id);

    // get all comments and aggregate
    return docRef
      .collection("operator")
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
  .document("shortcodeConfig/{ShortcodeId}/operator/{operatorId}")
  .onDelete((snap, context) => {

    const id = context.params.ShortcodeId;

    const docRef = admin
      .firestore()
      .collection("shortcodeConfig")
      .doc(id);

    const deletedValue = snap.data();

    return docRef
      .collection("operator")
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
  .document("exportJobs/{campaignId}/jobs/{jobId}")
  .onWrite((change, context) => {

    const id = context.params.campaignId;

    // const document = change.after.exists ? change.after.data() : null;

    const jobRef = admin
      .firestore()
      .collection("exportJobs")
      .doc(id);

    return jobRef
      .collection("jobs")
      .orderBy("createTime", "desc")
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

exports.LineNotify = functions.runWith({ memory: '2GB' }).pubsub
  .schedule('00 5 * * *').onRun(async context =>{

  // Consistent timestamp
  const now = admin.firestore.Timestamp.now();

  const queryTestState = admin
    .firestore()
    .collection("campaignValidate")
    .where("campaignState", "==", "test")
    .where("campaignDateTestEnd", ">", now)

  const queryProductionState = admin
    .firestore()
    .collection("campaignValidate")
    .where("campaignDateStart", ">", now)

  const tasks = await queryTestState.get();
  const tasks2 = await queryProductionState.get();

  // Jobs to execute concurrently. 
  const jobsTest = [];
  const jobsProduction = [];

  tasks.forEach(snapshot => {
    let item;

    item = `${snapshot.id} => ${snapshot.data().campaignState} \r\n`;
    
    jobsTest.push(item);
    
  });

  tasks2.forEach(snapshot => {

    let item;
    
    item = `${snapshot.id} => ${snapshot.data().campaignState} \r\n`;
    
    jobsProduction.push(item);
    
  });

  let testCamp = jobsTest.reduce((x, y) => x + y);
  let proCamp = jobsProduction.reduce((x, y) => x + y);

  const finalMessage = `TEST CAMPAIGNS:\r\n${testCamp}\r\nPRODUCTION CAMPAIGNS:\r\n${proCamp}`;

  request ({
      uri: "https://notify-api.line.me/api/notify",
      method: "POST",
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
    .collection("campaignValidate")
    .where("campaignState", "==", "test")
    .where("campaignDateTestEnd", ">", now)

  const queryProductionState = admin
    .firestore()
    .collection("campaignValidate")
    .where("campaignDateStart", ">", now)

  const tasks = await queryTestState.get();
  const tasks2 = await queryProductionState.get();

  // Jobs to execute concurrently. 
  const jobsTest = [];
  const jobsProduction = [];

  tasks.forEach(snapshot => {
    let item;

    let t = `${formatDate(snapshot.data().campaignDateStart.seconds)}`;
    let c = t.slice(0,15);

    item = `ID:"${snapshot.id}" => ${c} \r\n`;
    
    jobsTest.push(item);
    
  });

  tasks2.forEach(snapshot => {

    let item;
    let t = `${formatDate(snapshot.data().campaignDateStart.seconds)}`;
    let a = t.slice(0,15);
    
    item = `ID:"${snapshot.id}" => ${a} \r\n`;
    
    jobsProduction.push(item);
    
  });
  let nowText = `${formatDate(now.seconds)}`;
  let nowDate = nowText.slice(0,15);

  let testCamp = jobsTest.reduce((x, y) => x + y);
  let proCamp = jobsProduction.reduce((x, y) => x + y);

  const finalMessage = `${nowDate}\r\nWARNING!!!! \r\nTEST CAMPAIGNS (${jobsTest.length}):\r\n${testCamp}\r\nPRODUCTION FUTURE CAMPAIGNS (${jobsProduction.length}):\r\n${proCamp}`;

    request ({
          uri: "https://notify-api.line.me/api/notify",
          method: "POST",
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
  .document("users/{userId}")
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