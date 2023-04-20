const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
const Event=require('../models/eventModel');
const Artist=require('../models/artistModel.js');
const FavouriteArtist=require('../models/favouriteArtistsModel');
// @desc    Get events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  console.log('In get events')
  const events = await Event.find({})
 //console.log(events);
  res.status(200).json(events)
})
//fn to filter movies by interestTag

const filterEventsByInterest = async (events, interestTagArray) => {
  const response = await events.filter(event => {
    return interestTagArray.some(interestTag => event.genre.includes(interestTag));
  });
  return response;
}
// @desc    Get movies by interestTag
// @route   GET /api/events/eventsByInterest
// @access  Private
const getEventsByInterestTag = asyncHandler(async (req, res) => {
 // console.log('In get events by interest tag')
  const userId = req.id;
  let interestTagArrayObj = await User.find({ _id: userId }, { interestTag: 1, _id: 0 });
 // console.log(interestTagArrayObj);
  const interestTagArray = interestTagArrayObj[0]['interestTag'];
  const events = await Event.find({});
 // console.log(interestTagArray);
  //let filteredEvents = await filterEventsByInterest(events, interestTagArray);
    let filterObject = [];
    for (let tag of interestTagArray) {
    //console.log("in interestTag array loop")
    for (let event of events) {

console.log("tag in interest tag" + tag);
        let genre=event.genre;
       // console.log(genre);
      if (genre[0].includes(tag)) {

       // console.log("found event"+event);
        filterObject.push(event);
      }
    }
  }
 // console.log(filterObject);
  //console.log(filteredEvents);
   res.status(200).json(filterObject);
})

// @desc    Get events by location
// @route   GET /api/events/filter/:cityName
// @access  Private
const getEventsByCity = asyncHandler(async (req, res) => {
  console.log('In get events by cityname')
  const cityName = req.params.cityName;
  Event.find({})
    .populate({
      path: "cityId",
      match: { cityName },
    })
    .then((events) => {
      //console.log(events);
      res.status(200).json(events)
    })
    .catch((err) => {
      console.error(err);
    });
})

//fn to filter movies by interestTag

const filterEventsByFavArtist = async (events, artistNames) => {
  const response = await events.filter(event => {
    return artistNames.some(name => event.artistName.includes(name));
  });
  return response;
}
// @desc    Get events by favArtist
// @route   GET /api/events/favArtist
// @access  Private
const getEventsByFavArtist = asyncHandler(async (req, res) => {
  console.log('In get events by fav artists')
  const userId = req.id;
  const FavouriteArtistsArrayObj = await FavouriteArtist.findOne({ user: userId }).exec();
  const artistsArray=FavouriteArtistsArrayObj.artistsArray;
  const artistIds = artistsArray.map(artist => artist.toString()); // convert objectIds to string
  const artistNamesArray= await Artist.find({'_id':{ $in:artistIds }},{'artistName':1,'_id':0});
 const artistNames=[];
 for(let artistName of artistNamesArray)
 {
  artistNames.push(artistName.artistName);
 }
 //console.log(artistNames);
 const events = await Event.find({});
 const filteredObj= await filterEventsByFavArtist(events,artistNames);
 //console.log(filteredObj);
 res.status(200).json(filteredObj);
});


// @desc    get event by id
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(400)
    throw new Error('Event not found')
  }
  res.status(200).json(event)
})



module.exports = {
  getEvents,
  getEventsByInterestTag,
  getEventsByCity,
  getEventsByFavArtist,
  getEventById
}
