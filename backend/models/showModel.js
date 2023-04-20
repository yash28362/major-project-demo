
const mongoose = require('mongoose')

const showSchema = mongoose.Schema(
    {

        "date": Date,
        "startTime": String

    }
)
module.exports = mongoose.model("Show", showSchema)
