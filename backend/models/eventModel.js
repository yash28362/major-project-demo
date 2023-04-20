const mongoose = require('mongoose')
const eventSchema=mongoose.Schema(
    {
        "eventName":String,
        "artistName":[String],
        "genre":[String],
        "language":[String],
        "address":String,
        "venueImage":String,
        "mapLocation":String,
        "date":String,
        "time":String,
        "image":String,
        "cityId":[]

    }
)
module.exports=mongoose.model("Event",eventSchema)