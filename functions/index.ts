// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as rp from 'request-promise';
// admin.initializeApp();

// const request = rp.Defaults({ simple : false });
// const LINE_ACCESS_TOKEN = "zMsztWI7Jd20mx7nlDkdwPoaronXSFEf56WQRSSaF7A";


// export const LineNotify = functions.runWith({ memory: "1GB" }).pubsub
// .schedule("30 5 * * *").onRun(async context => {

//   // Consistent timestamp
//   const now = admin.firestore.Timestamp.now();

//   const queryTestState = admin
//     .firestore()
//     .collection("campaignValidate")
//     .where("campaignDateStart", ">", now)
//     .where("campaignDateEnd", "<", now)

//   const queryProductionState = admin
//     .firestore()
//     .collection("campaignValidate")
//     .where("campaignDateStart", ">", now)
//     .where("campaignDateEnd", "<", now)

//   const tasks = await queryTestState.get();
//   const tasks2 = await queryProductionState.get();

//   // Jobs to execute concurrently. 
//   const jobsTest: Promise<any>[] = [];
//   const jobsProduction: Promise<any>[] = [];

//   tasks.forEach(snapshot => {
//     let item;

//     item = `${snapshot.id} => ${snapshot.data().campaignState} \r\n`;
    
//     jobsTest.push(item);
    
//   });

//   tasks2.forEach(snapshot => {

//     let item;
    
//     item = `${snapshot.id} => ${snapshot.data().campaignState} \r\n`;
    
//     jobsProduction.push(item);
    
//   });

//   request ({
//     uri: "https://notify-api.line.me/api/notify",
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/x-www- form-urlencoded', 
//       'Authorization':  'Bearer'  +  LINE_ACCESS_TOKEN
//     },
//     form: {
//       // 'message': message
//     }
//   }).then((response) => {
//     console.log('User HAS% d repos', response.length);
//     console.log('response:', response);
//     return null;
//   }).catch (err => console.log(err));
// });
