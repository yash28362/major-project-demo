const mongoose = require('mongoose')

const citySchema=mongoose.Schema(
    { 
        "cityName":String
    })
module.exports=mongoose.model("City",citySchema)