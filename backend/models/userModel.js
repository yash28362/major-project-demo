const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },

    discount: {
      type: Number,
    },
    favArtist: {
      type:[String],
     // required: [true, 'Please add favourite artists'],
    },
    image: {
      type: String,
     // required: [true, 'Please add img'],
    },
    interestTag: {
      type: [String],
      //required: [true, 'Please add interestTag'],
    },
    roles: {
      type: [String],
      default:["Consumer"]
    },
    verifytoken:{
      type: String,
  }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
