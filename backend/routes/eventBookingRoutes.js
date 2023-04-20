const express = require('express')
const router = express.Router()


const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')
const { sendEventBookingTicketByMail, setEventBooking } = require('../controllers/eventBookingController')
router.route('/').post([protect],setEventBooking )
router.route('/sendTicketAsEmail').get([protect],sendEventBookingTicketByMail);
module.exports = router