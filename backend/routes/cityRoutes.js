const express = require('express')
const router = express.Router()
const {
 getCities
} = require('../controllers/cityController')


router.route('/').get( getCities);
module.exports=router
