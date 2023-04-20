const asyncHandler = require('express-async-handler')
const { ObjectId } = require('mongodb');
const Movie = require('../models/movieModel.js');
const Event = require('../models/eventModel');
const User = require('../models/userModel.js');
const Artist = require('../models/artistModel.js');
const City = require('../models/cityModel.js');
const { response } = require('express');
const mongoose = require('mongoose');
const FavouriteArtist = require('../models/favouriteArtistsModel');

// @desc    Get movies
// @route   GET /api/movies
// @access  Private
const getMovies = asyncHandler(async (req, res) => {
  console.log('In get movies')
  const movies = await Movie.find({});
  // console.log(movies);
  res.status(200).json(movies)
})
//fn to filter movies by interestTag

const filterMoviesByInterest = async (movies, interestTagArray) => {
  const response = await movies.filter(movie => {
    return interestTagArray.some(interestTag => movie.genre.includes(interestTag));
  });
  return response;
}
// @desc    Get movies by interestTag
// @route   GET /api/movies/moviesByInterestTag
// @access  Private
const getMoviesByInterestTag = asyncHandler(async (req, res) => {
  console.log('In get movies by interest tag')
  const userId = req.id;
  console.log(userId);

  try {
    let interestTagArrayObj = await User.find({ _id: userId }, { interestTag: 1, _id: 0 });
    if (!interestTagArrayObj || !interestTagArrayObj.length) {
      return res.status(400).json({ message: "No interest tags found for user" });
    }
    const interestTagArray = interestTagArrayObj[0]['interestTag'];

    let movies = await Movie.find({});
    if (!movies || !movies.length) {
      return res.status(400).json({ message: "No movies found" });
    }

    let filterObject = [];
    console.log(movies);

    for (let tag of interestTagArray) {
      console.log("in interestTag array loop")
      for (let movie of movies) {
        console.log("in interestTag array + movie loop")
        console.log("tag in interest tag" + tag);
        console.log("genre" + movie.genre);

        let genre = movie.genre;
        if (!genre || !genre.length || !genre[0].includes(tag)) {
          continue;
        }

        console.log(genre);
        console.log("found movie" + movie);
        filterObject.push(movie);
      }
    }
   console.log(filterObject);
    if(filterObject.length > 0) {
      return res.status(200).json(filterObject);
    } else {
      return res.status(400).json({ message: "No movies found for the given interest tags" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

});


// @desc    Get movies by location
// @route   GET /api/movies/filter/:cityName
// @access  Private
const getMoviesByCity = asyncHandler(async (req, res) => {
  console.log('In get movies by cityname')
  const cityName = req.params.cityName;
  Movie.find({})
    .populate({
      path: "cityid",
      match: { cityName },
    })
    .then((movies) => {
      //console.log(movies);
      res.status(200).json(movies)
    })
    .catch((err) => {
      console.error(err);
    });
})




//fn to filter movies by favArtist

const filterMoviesByFavArtist = async (movies, artistIds) => {
  const response = await movies.filter(movie => {
    return artistIds.some(id => movie.artistid.includes(id));
  });
  return response;
}


// @desc    Get movies by favArtist
// @route   GET /api/movies/favArtist
// @access  Private
const getMoviesByFavArtist = asyncHandler(async (req, res) => {
  console.log('In get movies by fav artists')
  const userId = req.id;
  const FavouriteArtistsArrayObj = await FavouriteArtist.findOne({ user: userId }).exec();
  //console.log(FavouriteArtistsArrayObj.artistsArray);
  const artistsArray = FavouriteArtistsArrayObj.artistsArray;
  const artistIds = artistsArray.map(artist => artist.toString()); // convert objectIds to string
  // console.log(artistIds);

  //1st way to solve
  const movies = await Movie.find({});
  const filteredObjs = await filterMoviesByFavArtist(movies, artistIds);
  //console.log(filteredObjs);
  res.status(200).json(filteredObjs);

  //2nd way to solve:
  // Movie.aggregate([
  //   // match documents where the 'artistid' field contains any of the artist IDs in the 'artistIds' array
  //   { $match: { artistid: { $in: artistIds } } },
  //   // populate the 'artists' field with actual artist documents
  //   { $lookup: { from: Artist.collection.name, localField: 'artistid', foreignField: '_id', as: 'artists' } },
  //   // remove the 'artistid' field as it's no longer needed
  //   { $project: { artistid: 0 } }
  // ]).exec()
  //   .then(movies => {
  //     res.send(movies);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     res.status(500).send('Error finding movies');
  //   });


});

// @desc    Get details by determining ,
//if id is from movies/events/artists and send all contents back 

// @route   GET /api/movies/searchResult/id
// @access  Private
const getSearchResult = asyncHandler(async (req, res) => {
  console.log('In get movies for searchResult')
  const id = req.params.id;
  console.log(id);
  try {
    const doc1 = await Movie.findById(id);
    if (doc1) {
      console.log('Document with ID', id, 'belongs to Collection1');
      res.status(200).json({ "doc": doc1, "CollectionName": "Movie" });
      return;
    }
    const doc2 = await Event.findById(id);
    if (doc2) {
      console.log('Document with ID', id, 'belongs to Collection2');
      res.status(200).json({ "doc": doc2, "CollectionName": "Event" });
      return;
    }
    const doc3 = await Artist.findById(id);
    if (doc3) {
      console.log('Document with ID', id, 'belongs to Collection3');
      res.status(200).json({ "doc": doc3, "CollectionName": "Artist" });
      return;
    }
    console.log('Document with ID', id, 'was not found in any collection');
  } catch (err) {
    console.error(err);
  }

})

// @desc    get movie by id
// @route   GET /api/movies/:id
// @access  Private
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    res.status(400)
    throw new Error('Goal not found')
  }
  res.status(200).json(movie)
})

// @desc    get movies by artistid
// @route   GET /api/movies/getMovies/artistid
// @access  Private
const getMovieByArtistId = asyncHandler(async (req, res) => {

  const artistid = req.params.artistid;
  console.log(artistid);
  console.log(typeof(artistid));
  try {
    const movie = await Movie.find({ artistid: { $in: [artistid] } }).populate('artistid');
    if (!movie || movie.length === 0) {
      return res.status(404).json({ message: 'No movies found for the artist' });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
  
  
})

module.exports = {
  getMovies,
  getMoviesByInterestTag,
  getMoviesByCity,
  getMoviesByFavArtist,
  getSearchResult,
  getMovieById,
  getMovieByArtistId

}
