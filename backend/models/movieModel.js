
const mongoose = require('mongoose')

const movieSchema=mongoose.Schema(
    {   
        "movieName":String,
        "image":String,
        "director":String,
        "genre":[String],
        "release date":String,
        "synopsis":String,
        "status":String,
        // "artistid":[{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:'Artist'
        // }],
        "artistid":[String],
        "theatreid":[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Theatre'
        }],
        "language":[String],
        "duration":String,
        "cityid":[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'City'
        }]
    }
)
module.exports=mongoose.model("Movie",movieSchema)
