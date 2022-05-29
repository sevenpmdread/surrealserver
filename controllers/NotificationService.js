var admin = require('firebase-admin')
var serviceAccount = require('../rn-firebase-key.json')
const { initializeApp } = require('firebase-admin/app');

module.exports =function async(registrationToken,title,message,senddata) {
  console.log(senddata)
  var payload = {
  data:{
    keys:''+ JSON.stringify(senddata)
  },
  notification:{
    "title":title,
    "message":message
  },
}
var options = {
  priority:"high",
  timeToLive:60*60*24
}
admin.messaging().sendToDevice(registrationToken,payload,options).then(function(response){
  console.log("Succefully sent message",response)
}).catch(function(error){
  console.log("error sending message",error)
})

}

