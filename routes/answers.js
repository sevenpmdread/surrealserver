const express = require('express')
const router = express.Router({ mergeParams: false });
const {getAnswersforCategory} = require('../controllers/Answer')
const {updateResponsecount} = require('../controllers/Metadeta')
//router.route('/:question').get(getAnswersforquestion)
//outer.post('/',createAnswer,updateResponsecount)
//router.route('/getall').get(getAllAnswers)
router.get("/:category",getAnswersforCategory)



module.exports = router
