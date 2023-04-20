const mongoose = require('mongoose')
const bookingForMovieSchema=mongoose.Schema({
    "movieName":String,
    "userId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    "totalPrice":String,
    "seatNos":[String],
    "showId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Show'
    },
    "bookingDate":String,
    "status":String,
    "noOfSeats":Number,
    "bookingTime":String
})
module.exports=mongoose.model("BookingForMovie",bookingForMovieSchema)