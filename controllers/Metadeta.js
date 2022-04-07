const Meta = require('../models/PostMetadata')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')


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
const updateSharecount = async (req,res) => {

  try{
  const {user:{userId}} = req
  const {postid} = req.body
  const post = await Meta.findOne({post_id:postid})
  if(!post)
  {
    postdetails = await Meta.create({post_id:postid ,sharecount:1})
  }
  else
  {postdetails =   await Meta.updateOne({
  post_id:postid
  }, {  $inc: { sharecount: 1 }})}
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
  console.log('Reached here')
  const post = await Meta.findOne({post_id:postid})
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
  res.status(StatusCodes.OK).json({postdetails})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch post by id")

}

}

module.exports  = {
  getCount,updatePincount,updateSharecount,updateResponsecount
}
