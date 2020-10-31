
export default function (number, length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (number){
    possible = "0123456789";
  }
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// function refreshID () {
//   $("#msisdn").val("66"+makeid(true, 9));
//   $("#serviceID").val(makeid(true, 18));
//   $("#shortcode").val("4712003");
//   $("#sendAddress").val("66"+makeid(true, 13));
//   $("#transactionID").val(makeid(true, 18));
// }