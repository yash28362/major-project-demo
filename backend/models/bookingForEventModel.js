const mongoose = require('mongoose')
const bookingForEventSchema=mongoose.Schema({
    "eventName":String,
    "userId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    "status":String,
    "totalPrice":String,
    "totalSeats":String,
    "eventId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    },
    "bookingDate":String,
    "noOfSeats":Number,
    "bookingTime":String
})
module.exports=mongoose.model("BookingForEvent",bookingForEventSchema)
