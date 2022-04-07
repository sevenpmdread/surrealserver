const Pin = require('../models/Pins')
const Meta = require('../models/PostMetadata')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')


const findpin = async(req,res) => {
  try{
    console.log("reached find pin")
    const {user:{userId}} = req
    const {postid,username} = req.body
    console.log(postid,username)
    const pin = await Pin.find({
      post_id:postid,pinnedbyuser:username
    })
    console.log("PIN -> ",pin)

    if(!pin)
  {
    return res.status(StatusCodes.OK).json({count:0})
  }
  return res.status(StatusCodes.OK).json({pin})

  }
  catch(error)
  {

  }
}

const getPins = async (req,res) => {

  try{
  console.log('Reached getPins')
  const {user:{userId}, params:{filter:filterinput}} = req
  let pins = []
  console.log(filterinput)
  if(ObjectId.isValid(filterinput))
  {
  console.log("reached if")
  pins =   await Pin.find({
  post_id:filterinput
  })
  }
  else
  {

  pins =   await Pin.find({
      pinnedbyuser:filterinput
      })
  }


    if(!pins)
  {
    return res.status(StatusCodes.OK).json({count:0})
  }
  res.status(StatusCodes.OK).json({pins,count:pins.length})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch pins for user")

}

}
const getPinsbyUser = async (req,res) => {
  try{
    console.log("REACH THIS")
    const {user:{userId}} = req
    const {username} = req.body
    console.log(username)
    const pins = await Pin.aggregate([ 
      {$match:{'pinnedbyuser':username}},
      { $lookup:
         {
           from: "answers",
           localField: "post_id",
           foreignField: "_id",
           as:"answersid" 
         } 
         },
         {
        $unwind: '$answersid' //  You have to use $unwind on an array if you want to use a field in the subdocument array to further usage with `$lookup` 
      },
       {
        $lookup: {
          from: "questions",
          localField: "answersid.question_id",
          foreignField: "_id",
          as: "Finalquestions"
        }
      },
      {
        $unwind: '$Finalquestions' //  You have to use $unwind on an array if you want to use a field in the subdocument array to further usage with `$lookup` 
      },
      {
        $group:{
          _id:{ question_text: "$Finalquestions.question_text",question_id:"$Finalquestions._id"},
          answer:{$push:{answertext:"$answersid",pinned_at:'$createdAt'}}
        }
      }
         ])
    return res.status(StatusCodes.OK).json({pins,count:pins.length})

  }
  catch(error){
    console.log(error)
    throw new BadRequestError("Error in fetch user for pins")

  }
}
const pinpost = async (req,res) => {
  try {
    console.log("pin post server")
    const {post_id,pinnedbyuser:username} = req.body
    var pin = await Pin.findOne({post_id:post_id,pinnedbyuser:username})
    var postdetails = {}
    if(pin)
    {
      console.log("pin post server",pin)
      throw new BadRequestError("Already pinned")
    }
    else
    {
      pin = await Pin.create({post_id,pinnedbyuser:username})
      const post = await Meta.findOne({post_id:post_id})
      if(!post)
      {
        postdetails = await Meta.create({post_id:post_id , pincount:1})
      }
      else
      postdetails =   await Meta.updateOne({
      post_id:post_id
      }, {  $inc: { pincount: 1 }})
    }
    return res.status(StatusCodes.OK).json({pin,postdetails})

  }
  catch(error) {
    console.log(error)
    throw new BadRequestError(error)
  }
}

const unpinpost = async(req,res) => {
  try{
    console.log("DELTED")
    const {post_id,pinnedbyuser:username} = req.body
    console.log("post id, username",post_id,username)
    var pin = await Pin.findOne({post_id,pinnedbyuser:username})
    var postdetails = {}
    console.log(pin)
    if(!pin){
      throw new BadRequestError("Post doesn't exist")
    }
    else{
      pin = await Pin.deleteOne({post_id,pinnedbyuser:username})
   //   pin = await Pin.create({post_id,pinnedbyuser:username})
      const post = await Meta.findOne({post_id:post_id})
      postdetails =   await Meta.updateOne({
      post_id:post_id
      }, {  $inc: { pincount: -1 }})
    }
    res.status(StatusCodes.OK).json({deleted:'deleted'})

  }
  catch(error){
    console.log(error)
    throw new BadRequestError(error)
  }
}

module.exports  = {
  pinpost,unpinpost,getPins,findpin,getPinsbyUser
}
