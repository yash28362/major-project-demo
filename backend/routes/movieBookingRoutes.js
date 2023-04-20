const express = require('express')
const router = express.Router()


const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')
const { sendMovieBookingTicketByMail, setMovieBooking } = require('../controllers/movieBookingController')
router.route('/').post([protect],setMovieBooking )
router.route('/sendTicketAsEmail').get([protect],sendMovieBookingTicketByMail);
module.exports = router