const Question = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const bcrypt = require('bcryptjs')
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')


var categories = ['existential','vent','personal','growth','confrontational']
const getAllQuestions = async (req,res) => {
  console.log(req.params)
  try {
  const questions = await Question.find({})
  res.status(StatusCodes.ACCEPTED).json({questions,nbHits:questions.length})
  }
  catch(err){
    throw new BadRequestError("Error in fetch jobs")
  }

}

const fetchhomedata = async(req,res) => {
  try {

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
        questions: { $push: { id: "$_id", text: "$question_text", count:{$arrayElemAt : ["$questionsids", 0] }} }
    }
    },
     ]
     )
     res.status(StatusCodes.ACCEPTED).json({questions,nbHits:questions.length})

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
  getAllQuestions,getQuestion,createQuestion,fetchhomedata
}
