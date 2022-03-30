const Answer = require('../models/Answers')
const Question = require('../models/Job')
const Meta = require('../models/PostMetadata')
const {updateResponsecount} = require('../controllers/Metadeta')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const getAllAnswers = async (req,res) => {
  try {
  const answers = await Answer.find({})
 // console.log(answers)
  // const answersall = []
  // answers.forEach(ans => {
  // //  console.log("ans -> ", ans)
  //   ans.answerlist.forEach(ansnew => {
  //  //   console.log("ansnew -> ", ansnew)
  //     answersall.push(ansnew.answer_text)
  //   })
  // })

 // console.log(answersall)
  res.status(StatusCodes.ACCEPTED).json({answers,nbHts:answers.length})
  }
  catch(err){
    throw new BadRequestError("Error in fetch answers")
  }

}

const getAnswersforquestion = async (req,res) => {
  const {user:{userId}, params:{question:question}} = req
  conso
  const answers = await Answer.find({
    question_text:question
  })
  if(!answers)
  {
    throw new NotFoundError('Job id not found')
  }
  res.status(StatusCodes.OK).json({answers,nHits:answers.length})

}

const getAnswersforCategory = async (req,res) => {
  const {user:{userId}, params:{category:category}} = req
  try{
  console.log("reached this field")
  const answers = await Question.aggregate( [

    { $match : { category : category } },


     { $lookup:
    {
      from: "answers",
      localField: "_id",
      foreignField: "question_id",
      as:"answersids"
    }
    },
    { $sort : { answersids : -1 } }


    ] )
    res.status(StatusCodes.OK).json({answers,nHits:answers.length})
  }
  catch(error){
    throw new BadRequestError("Error in category fetch answers")
  }
  // const answers = await Answer.find({
  //   category:category
  // })
  // if(!answers)
  // {
  //   throw new NotFoundError('Job id not found')
  // }
  // res.status(StatusCodes.OK).json({answers,nHits:answers.length})

}
const getAnswersforUsers = async (req,res) => {
  const {user:{userId}} = req
  const answers = await Answer.find({
    user_id:userId
  })
  if(!answers)
  {
    throw new NotFoundError('Job id not found')
  }
  res.status(StatusCodes.OK).json({answers,nHits:answers.length})

}

const createAnswer = async (req,res,next) => {
  const {user:{userId}} = req
  const {question_id,answer_text,username,isAnonymous} = req.body

  try {
  console.log(req.body)
  const answer = await Answer.create({question_id,answer_text,username,isAnonymous})
  next()
}
  catch(err)
  {
    console.log(err)
    res.status(StatusCodes.BAD_REQUEST).json(err)
  }
}



module.exports  = {
  getAllAnswers,getAnswersforUsers,getAnswersforCategory,getAnswersforquestion,createAnswer
}
