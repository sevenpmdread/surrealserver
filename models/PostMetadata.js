const mongoose  = require('mongoose')
const metadata = new mongoose.Schema({
post_id:mongoose.ObjectId ,
sharecount:{
  type:Number,
  default:0,
  min:0
},
responsecount:{
  type:Number,
  default:0,
  min:0

},
pincount:{
  type:Number,
  default:0,
  min:0

},
upvotecount:{
  type:Number,
  default:0,
  min:0

}
},{timestamps:true})


module.exports = mongoose.model('Metadata',metadata)
