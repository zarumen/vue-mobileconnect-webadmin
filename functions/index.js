const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

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