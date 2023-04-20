const asyncHandler = require('express-async-handler')
const Artist = require('../models/artistModel')
const User = require('../models/userModel')
const FavouriteArtist=require('../models/favouriteArtistsModel');

// @desc    Get artists
// @route   GET /api/artists
// @access  Private
const getArtists = asyncHandler(async (req, res) => {
    console.log('In get artists')
   // const userId = req.id;
   const artists = await Artist.find()
   // console.log(artists);
    res.status(200).json(artists);
  });

  // @route   POST /api/artists/favArtists
// @access  Private
const setFavArtists = asyncHandler(async (req, res) => {
  console.log('In post favartists')
  const userId = req.id;
  console.log(userId);
  const user=await FavouriteArtist.find({"user":userId});
  console.log(user);
  console.log(user.length);
  if(user.length != 0)
  {
    console.log("user found in favArtist");
    res.status(400)
    throw new Error('Please update artists instead of adding')
  }
  if (!req.body.artistsArray) {
    res.status(400)
    throw new Error('Please add artists')
  }
 if(user.length==0)
 {
  const favArtists = await FavouriteArtist.create({
    artistsArray: req.body.artistsArray,
    user: userId
  })
 // console.log(favArtists);

 res.status(200).json(favArtists)
 }
});



// @desc    get artist by id
// @route   GET /api/artists/:id
// @access  Private
const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id)

  if (!artist) {
    res.status(400)
    throw new Error('Artist not found')
  }
  res.status(200).json(artist)
})


  module.exports={getArtists,setFavArtists,getArtistById}