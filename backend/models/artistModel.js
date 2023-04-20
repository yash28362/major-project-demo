// artists:
//   id
//   artistName
//   birthdate
//   birthplace
//   image
//   description
//   occupation
const mongoose = require('mongoose');

const artistSchema = mongoose.Schema(
  {
    artistName: {
      type: String,
      required: [true, 'Please add a name'],
    },
    birthdate:{
        type: String   
    },
    birthPlace: {
        type: String
      },
    image: {
      type: String
   
    },
    description: {
      type: String
    },
    occupation:{
      type: [String],
  }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Artist', artistSchema)
