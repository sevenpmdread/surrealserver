const Question = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const Meta = require('../models/PostMetadata')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')


var categories = ['existential','vent','personal','growth','confrontational']
const createVentQuestion = async (req,res,next) => {
  const {user:{userId}} = req
  const {question_text,username,isAnonymous} = req.body
  console.log("reched here")

  try {
  //console.log(req.body)
  const question = await Question.create({question_text,lastAnswered:Date.now(),category:"vent",username,isAnonymous})
  console.log(question)
  postdetails = await Meta.create({post_id:question._id,responsecount:0,upvotecount:0,pincount:0,sharecount:0})
  //next()
 // res.status(StatusCodes.BAD_REQUEST).json(question)
 return res.status(StatusCodes.ACCEPTED).json(question)

}
  catch(err)
  {
    console.log(err)
    res.status(StatusCodes.BAD_REQUEST).json(err)
  }
}

const getRandomQuestion  = async(req,res) => {
  try{
    console.log("REACHED GET RANDOM")
    const question = await Question.aggregate([{ $sample: { size: 1 } }])
    return res.status(StatusCodes.ACCEPTED).json({question})

  }
  catch(error)
  {
    console.log(error)
    throw new BadRequestError(error)
  }
}
const getAllQuestions = async (req,res) => {
  const {params:{skip:skip}} = req
  try {
  const questions = await Question.aggregate([
    { $skip : skip*10},
    { $limit:10 },
]);
  return res.status(StatusCodes.ACCEPTED).json({questions,nbHits:questions.length})
  }
  catch(err){
    throw new BadRequestError(error)
  }

}

const ventexplore = async(req,res) => {
  try{
    const {params:{skip:skip}} = req
   // console.log(req.params,skip)
    const posts = await Question.aggregate([
      { $match : { category : "vent" } },
      { $sort : { lastAnswered : -1 } },
      { $skip: skip*5 },
       { $limit:5 },
       { $lookup:
      {
        from: "metadatas",
        localField: "_id",
        foreignField: "post_id",
        as:"metadata",
      }
      },
        { $lookup:
      {
        from: "answers",
        localField: "_id",
        foreignField: "question_id",
        as:"answers",
        pipeline :[
          { $limit:10 },
          { $sort : { createdAt : -1 } }
        ]
      }
      },
  ])
  if(!posts)
  {
    throw new BadRequestError("no posts found for explore")
  }
  else
  res.status(StatusCodes.ACCEPTED).json({posts,nbHits:posts.length})
  }
  catch(error)
  {
    console.log(error)
    throw new BadRequestError("I AM HERE")
  }
}
const exploredata = async(req,res) => {

  try{
    const {params:{skip:skip}} = req
    console.log(req.params,skip)
    const posts = await Question.aggregate([
      { $sort : { lastAnswered : -1 } },
      { $skip: skip*5 },
       { $limit:5 },
       { $lookup:
      {
        from: "metadatas",
        localField: "_id",
        foreignField: "post_id",
        as:"metadata",
      }
      },
        { $lookup:
      {
        from: "answers",
        localField: "_id",
        foreignField: "question_id",
        as:"answers",
        pipeline :[
          { $limit:10 },
          { $sort : { createdAt : -1 } }
        ]
      }
      },
  ])
  if(!posts)
  {
    throw new BadRequestError("no posts found for explore")
  }
  else
  res.status(StatusCodes.ACCEPTED).json({posts,nbHits:posts.length})
  }
  catch(error)
  {
    console.log(error)
    throw new BadRequestError('I AM THERE')
  }
}

const fetchhomedata = async(req,res) => {
  try {

  console.log("REACHED HERE in fetchHOME DATA")

  const questions = await Question.aggregate([

    { $lookup:
     {
       from: "metadatas",
       localField: "_id",
       foreignField: "post_id",
       as:"questionsids"
     }
     },
      { $group :
    {
        _id : "$category",
        questions: { $push: { id: "$_id", text: "$question_text", desc:"$desc", count:{$arrayElemAt : ["$questionsids", 0] }} }
    }
    },
     ]
     )
     return res.json({questions,nbHits:questions.length})

    }
    catch(error) {
      console.log(error)
      throw new BadRequestError("Error in fetch Question by id")
    }

}


const getQuestion = async (req,res) => {
  // console.log(req.params)
  // res.send("user")
  try{
  var question = {}
  const {user:{userId}, params:{filter:filterinput}} = req
  console.log(categories.includes(filterinput),filterinput,ObjectId.isValid(filterinput))
  if(ObjectId.isValid(filterinput))
  {
   question =   await Question.findOne({
    _id:filterinput
  })
  }
  else if(categories.includes(filterinput))
  {
     question =   await Question.find({
      category:filterinput
    })
  }
  else {
     question =   await Question.findOne({
      question_text:{"$regex": /filterinput/}
    })
  }
  if(!question)
  {
    throw new NotFoundError('Question id not found')
  }
  res.status(StatusCodes.OK).json({question})
}
catch(error){
  console.log(error)
  throw new BadRequestError("Error in fetch Question by id")

}

}

const createQuestion = async (req,res) => {
  const {question_text,category} = req.body
  try {
  const question = await Question.create({question_text,category})
  res.status(StatusCodes.CREATED).json({question})}
  catch(err)
  {
    res.status(StatusCodes.BAD_REQUEST).json(err)
  }
}

// const updateJob = async (req,res) => {
//   const {
//     body:{company,position},
//     user:{userId},
//     params:{id:jobId}
//   } = req
//   if(position === "" || company == "")
//   throw new BadRequestError('Please include company and position name')

//   const job = await Job.findByIdAndUpdate({
//     _id:jobId,createdBy:userId
//   },req.body,{new:true,runValidators:true})
//   if(!job)
//   {
//     throw new NotFoundError('Job id not found')
//   }
//   res.status(StatusCodes.OK).json({job})
// }

// const deleteJob = async(req,res) => {
//   const {
//     user:{userId},
//     params:{id:jobId}
//   } = req
//   const job = await Job.deleteOne({
//     _id:jobId
//   })
//   if(!job)
//   {
//     throw new NotFoundError('Job id not found')

//   }
//   res.status(StatusCodes.OK).json({job})
// }

module.exports  = {
  ventexplore,createVentQuestion,getRandomQuestion,exploredata,getAllQuestions,getQuestion,createQuestion,fetchhomedata
}
