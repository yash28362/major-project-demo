const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Theatre=require('../models/theatreModel');
const Show=require('../models/showModel');

// @desc    Get theatres and shows
// @route   GET /api/theatres/shows
// @access  Private
const getTheatres = asyncHandler(async (req, res) => {
  console.log('In get theatres')
  const theatres = await Theatre.find({})
 // Get all theatres and populate shows data
Theatre.find({})
.populate('showid')
.then(theatres => {
    console.log(theatres);
    return res.status(200).json(theatres);
})
  .catch(err => {
    console.error(err);
  });

})


module.exports = {
  getTheatres
}
