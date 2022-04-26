const mongoose  = require('mongoose')
const QuestionSchema = new mongoose.Schema({
question_text:{
  type:String,
  unique:true,
  required:[true,"Please provide a question name"],
  maxlength:100,
},
desc:{
  type:String
},
category:{
  type:String,
  required:[true,'Please provide category'],
  maxlength:50
},
lastAnswered:Date,
username:String,
isAnonymous:Boolean
},{ timestamps: true })

module.exports = mongoose.model('Question',QuestionSchema)
