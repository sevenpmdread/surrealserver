const mongoose  = require('mongoose')

const AnswerSchema = new mongoose.Schema({
question_id:mongoose.ObjectId,
answer_text:String,
username: {
type:String,
required:true
},
isAnonymous:Boolean,
contrast: mongoose.ObjectId

},{ timestamps: true })


module.exports = mongoose.model('Answer',AnswerSchema)
