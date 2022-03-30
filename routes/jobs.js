const express = require('express')
const router = express.Router({ mergeParams: false });
const {getAllQuestions,getQuestion,createQuestion,fetchhomedata} = require('../controllers/jobs')

router.route('/').post(createQuestion).get(getAllQuestions)
router.route('/fetchbulk').get(fetchhomedata)
router.route('/:filter').get(getQuestion) //.delete(deleteJob).patch(updateJob)


module.exports = router
