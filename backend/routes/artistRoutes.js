const express = require('express')
const router = express.Router()
const { getArtists, setFavArtists, getArtistById } = require('../controllers/artistController')

const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')

router.route('/').get(getArtists)
router.route('/:id').get(getArtistById)
router.route('/:id').delete([protect,verifyRoles("Organizer","Consumer")], ).put([protect,verifyRoles("Organizer","Consumer")],)
router.route('/favArtists').post([protect,verifyRoles("Consumer")],setFavArtists)
module.exports = router
