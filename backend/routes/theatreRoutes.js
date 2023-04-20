const express = require('express')
const router = express.Router()
const {getTheatres } = require('../controllers/theatreController')

const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')

router.route('/shows').get(getTheatres);

module.exports = router