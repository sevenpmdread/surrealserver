const express = require('express')
const router = express.Router({ mergeParams: true });
const {getPinsbyUser,getPins,pinpost,unpinpost,findpin} = require('../controllers/Pin')

router.get('/:filter',getPins)
router.post('/getPins',getPinsbyUser)
router.post('/findpost',findpin)
router.route('/pinpost').post(pinpost)
router.route('/unpin').post(unpinpost)

module.exports = router
