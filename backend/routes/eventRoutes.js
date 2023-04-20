const express = require('express')
const router = express.Router()
const { getEvents,getEventsByInterestTag, getEventsByCity, getEventsByFavArtist, getEventById } = require('../controllers/eventController')

const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')

router.route('/').get(getEvents);
router.route('/:id').get(getEventById)
router.route('/filter/:cityName').get(getEventsByCity)
router.get('/eventsByInterest', protect,getEventsByInterestTag)
router.get('/favArtist', protect, getEventsByFavArtist)
module.exports = router