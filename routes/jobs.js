const express = require('express')
const router = express.Router({ mergeParams: true });
const {getQoD,createVentQuestion,ventexplore,getRandomQuestion,getAllQuestions,fetchhomedata,exploredata} = require('../controllers/jobs')

router.route('/random').get(getRandomQuestion)
router.route('/qod').get(getQoD)
router.route('/:skip').get(getAllQuestions)
router.route('/explore/:skip').get(exploredata)
router.route('/ventexplore/:skip').get(ventexplore)
router.route('/').get(fetchhomedata)
router.route('/ventquestion').post(createVentQuestion)
//router.route('/:filter').get(getQuestion) //.delete(deleteJob).patch(updateJob)


module.exports = router
