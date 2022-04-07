const mongoose  = require('mongoose')
const Pindb = new mongoose.Schema({
post_id:{
  type:mongoose.ObjectId,
  required:true
} ,
pinnedbyuser:{
  type:String,
  required:true
}
},{timestamps:true})


module.exports = mongoose.model('PinDB',Pindb)
