const mongoose = require('mongoose')

const theatreSchema=mongoose.Schema(
    { 
        "theatreName":String,
        "mapLocation":String,
        "address":String,
        "cityid":[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'City'
        }],
        "showid":[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Show'
        }],
        
    })
module.exports=mongoose.model("Theatre",theatreSchema)
