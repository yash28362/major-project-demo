const express = require('express')
const router = express.Router()
const { getMovies, getMoviesByInterestTag, getMoviesByCity, getMoviesByFavArtist, getEventsMoviesArtists, getSearchResult, getMovieById, getMovieByArtistId } = require('../controllers/movieController')

const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')

router.route('/').get(getMovies)
router.route('/:id').get(getMovieById)
router.route('/getMovies/:artistid').get(getMovieByArtistId)
router.route('/searchResult/:id').get(getSearchResult);
router.route('/filter/:cityName').get(getMoviesByCity);
router.route('/moviesByInterestTag').get([protect], getMoviesByInterestTag)
router.get('/favArtist', protect, getMoviesByFavArtist)
module.exports = router