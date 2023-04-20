const mongoose = require('mongoose')

const favArtistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    artistsArray: [
        {
          type:  mongoose.Schema.Types.ObjectId,
          ref:'Artist'
        }
      ]
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('FavouriteArtist', favArtistSchema)
