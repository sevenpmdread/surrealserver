const express = require('express')
const router = express.Router({ mergeParams: false });
const {getCount,updateResponsecount,updatePincount,updateSharecount} = require('../controllers/Metadeta')

router.get("/:postid",getCount)
router.route('/sharecount').post(updateSharecount)
router.route('/pincount').post(updatePincount)
router.route('/responsecount').post(updateResponsecount)


module.exports = router
