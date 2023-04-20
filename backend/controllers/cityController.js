const asyncHandler = require('express-async-handler')

const City=require('../models/cityModel');


// @desc    Get cities
// @route   GET /api/cities
// @access  Private
const getCities = asyncHandler(async (req, res) => {
  console.log('In get cities')
  
  const cities = await City.find({})
 //console.log(cities);
  res.status(200).json(cities)
})


module.exports = {
  getCities
  
}
