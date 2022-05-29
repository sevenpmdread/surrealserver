const Meta = require('../models/PostMetadata')
const Answer = require('../models/Answers')
const Question = require('../models/Job')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const NotificationService = require('./NotificationService')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')


const getTrending = async(req,res) => {
  try{


 const repsonse = await Meta.aggregate([

  { $lookup:
 {
   from: "answers",
   localField: "post_id",
   foreignField: "_id",
   as:"answer",
 }
 },
 {
$match: {
 answer: {
   $size: 1
 }
}},
{
  $sort : { sharecount : -1,pincount:-1 }
},
{
$unwind: '$answer' //  You have to use $unwind on an array if you want to use a field in the subdocument array to further usage with `$lookup`
},
{ $lookup:
 {
   from: "questions",
   localField: "answer.question_id",
   foreignField: "_id",
   as:"question",
 }
 }
 ,
 {
   $limit:5
 }
])
return res.json(repsonse)
  }
  catch(error)
  {
    throw new BadRequestError(error)
  }
}


const getCount = async (req,res) => {

  try{
  console.log('Reached getCount')
  const {user:{userId}, params:{postid:postid}} = req
  postdetails =   await Meta.findOne({
  post_id:postid
  })

    if(!postdetails)
  {
    return res.status(StatusCodes.OK).json({count:0})
  }
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}

const updateVotecount = async (req,res) => {

  try{
  const {user:{userId}} = req
  const {postid} = req.body
  const post = await Meta.findOne({post_id:postid})
  if(!post)
  {
    postdetails = await Meta.create({post_id:postid ,upvotecount:1})
  }
  else
  {postdetails =   await Meta.updateOne({
  post_id:postid
  }, {  $inc: { upvotecount: 1 }})}
    if(!postdetails)
  {
    throw new NotFoundError('post id not found')
  }

const finduser = await Question.findOne({_id:postid})
//console.log(finduser)
if(finduser.username)
{
const user =await  User.find({username:finduser.username})
//console.log(user[0].devicetoken,finduser.answer_text)
//await NotificationService(user[0].devicetoken,"Your repsonse was shared!",finduser.answer_text,{type:'share',answer:finduser,user})

await NotificationService(user[0].devicetoken,`Your question ${finduser.question_text} was upvoted!`,finduser.question_text,{type:'upvote',question:finduser})
}
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}
const updateSharecount = async (req,res) => {

  try{
  const {postid} = req.body
  const post = await Meta.findOne({post_id:postid})
  if(!post)
  {
    postdetails = await Meta.create({post_id:postid ,sharecount:1})
  }
  else
  {
  postdetails =   await Meta.updateOne({
  post_id:postid
  }, {  $inc: { sharecount: 1 }})

}
const finduser = await Answer.findOne({_id:postid})
//console.log(finduser)
const user =await  User.find({username:finduser.username})
//console.log(user[0].devicetoken,finduser.answer_text)
await NotificationService(user[0].devicetoken,"Your repsonse was shared!",finduser.answer_text,{type:'share',answer:finduser,user})
    if(!postdetails)
  {
    throw new NotFoundError('post id not found')
  }
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}
const updateResponsecount = async (req,res) => {
``
  try{
  console.log("Reacher at the begining of updateResponse")
  const {user:{userId}} = req
  var {postid,question_id} = req.body
  postid = postid || question_id
  const post = await Meta.findOne({post_id:postid})
  console.log('Reached here',post)

  if(!post)
  {
    postdetails = await Meta.create({post_id:postid,responsecount:1})
  }
  else
  {
    console.log("IN HERE")
    postdetails =   await Meta.updateOne({
  post_id:postid
  }, {  $inc: { responsecount: 1 }})
}
    if(!postdetails)
  {
    throw new NotFoundError('post id not found')
  }
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}
const updatePincount = async (req,res) => {

  try{
  const {user:{userId}} = req
  const {postid} = req.body
  const post = await Meta.findOne({post_id:postid})
  if(!post)
  {
    postdetails = await Meta.create({post_id:postid , pin:1})
  }
  else
  postdetails =   await Meta.updateOne({
  post_id:postid
  }, {  $inc: { pin: 1 }})
    if(!postdetails)
  {
    throw new NotFoundError('post id not found')
  }

const finduser = await Answer.findOne({_id:postid})
//console.log(finduser)
const user =await  User.find({username:finduser.username})
//console.log(user[0].devicetoken,finduser.answer_text)
await NotificationService(user[0].devicetoken,"Your repsonse was pinned!",finduser.answer_text,{type:'pin',answer:finduser,user})
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}

module.exports  = {
  getCount,updateVotecount,updatePincount,updateSharecount,updateResponsecount,getTrending
}
