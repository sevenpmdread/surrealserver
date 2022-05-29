const Answer = require('../models/Answers')
const Question = require('../models/Job')
const User = require('../models/User')
const Meta = require('../models/PostMetadata')
const {updateResponsecount} = require('../controllers/Metadeta')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const NotificationService = require('./NotificationService')


const createContrast= async (req,res) => {
  try{
  //  const {user:{userId}} = req
    const {answerId,contrastId} = req.body
    console.log(answerId,contrastId)
    const oganswer = await Answer.find({_id:answerId})
    if(oganswer[0].contrast == contrastId)
    {
       throw new BadRequestError("Contrast already exists")
     //  return  res.status(StatusCodes.BAD_REQUEST)
    }
      const answerUpdate = await Answer.findOneAndUpdate({_id:answerId},
        {$set : {"contrast":contrastId}},{returnDocument: "after"})

    return  res.status(StatusCodes.OK).json({answerUpdate})
  }
  catch(error)
  {
    console.log(error)
    throw new BadRequestError(error)


  }
}

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

const getAnswersforId = async(req,res) => {
  const {user:{userId}} = req
  const {id,skip,limit} = req.body
  console.log("in get answers for id",id)
  const answers = await Answer.find({
    question_id:id
  }).limit(limit).skip(skip).sort({createdAt:-1})
  console.log("in get answers for id",answers)
  if(!answers)
  {
    throw new NotFoundError('question id not found')
  }
 return  res.status(StatusCodes.OK).json({answers,nHits:answers.length})
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

const getresponsesbyuser = async (req,res) => {
  try{
  const {user:{userId}} = req
  const {username} = req.body
  const answers = await Answer.aggregate([
    {$match:{'username':username}},
     { $lookup:
     {
     from: "questions",
     localField: "question_id",
     foreignField: "_id",
     as:"answersnew"
   }
   },
   { $sort : { createdAt : -1 } },
    {
    $unwind: '$answersnew' //  You have to use $unwind on an array if you want to use a field in the subdocument array to further usage with `$lookup`
  },
   {
  $group :
    {
      _id : { question_text: "$answersnew.question_text",question_id:"$question_id"},
      answer:{$push:{answer_text:"$answer_text",isAnonymous:'$isAnonymous',createdAt:'$createdAt',updatedAt:'$updatedAt',_id:'$_id'}}
      }}
])
  if(!answers)
  {
    throw new NotFoundError('Job id not found')
  }
  return res.status(StatusCodes.OK).json({answers,nHits:answers.length})
}
catch(error)
{
  throw new BadRequestError(error)
}

}

const getAnswer = async (req,res) => {
  try{
    const {id} = req.body
    const contrastAnswer  = await Answer.findOne({_id:id})
    if(!contrastAnswer)
    {
      throw new BadRequestError(
        "No answer found for contrast id"
      )
    }
   return  res.status(StatusCodes.OK).json({contrastAnswer})
  }
  catch(error)
  {
    throw new BadRequestError(error)
  }
}

const createAnswer = async (req,res,next) => {
  const {user:{userId}} = req
  const {question_id,answer_text,username,isAnonymous} = req.body

  try {
  console.log(req.body)
  const answer = await Answer.create({question_id,answer_text,username,isAnonymous})
  const question = await Question.findOneAndUpdate({_id:question_id},{ lastAnswered:Date.now()})
  if(question.username)
  {

const user =await  User.find({username:question.username})
//console.log(user[0].devicetoken,finduser.answer_text)
await NotificationService(user[0].devicetoken,`${question.question_text} has a new response!`,`  ${isAnonymous ? `anonymous responded with` : username + ' responded with - '} ${answer_text}`,{type:'response',question,answer_text,responseby:isAnonymous ? 'anonymous' : username})
  }
  next()
}
  catch(err)
  {
    console.log(err)
    res.status(StatusCodes.BAD_REQUEST).json(err)
  }
}

const createVentAnswer = async (req,res,next) => {
  const {user:{userId}} = req
  const {question_text,answer_text,username,isAnonymous} = req.body

  try {
  //console.log(req.body)
  const question = await Question.create({question_text,lastAnswered:Date.now(),category:"vent",username,isAnonymous})
  console.log(question)
 // res.status(StatusCodes.BAD_REQUEST).json(question)

  const answer = await Answer.create({question_id:question._id,answer_text,username,isAnonymous})
  req.body.postid = question._id
  next()
}
  catch(err)
  {
    console.log(err)
    res.status(StatusCodes.BAD_REQUEST).json(err)
  }
}



module.exports  = {
createContrast,getAnswer,
getAnswersforId,createVentAnswer,getAllAnswers,getAnswersforCategory,getAnswersforquestion,createAnswer,getresponsesbyuser,
}
