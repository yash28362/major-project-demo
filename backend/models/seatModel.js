
const mongoose = require('mongoose')
const movieSchema=mongoose.Schema(
    {   
        
        "price":String,
        "seatNo":String,
        "seatStatus":String,
        "showid":{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Show'
        },
        "Category":String
    }
)
module.exports=mongoose.model("Seat",seatSchema)
