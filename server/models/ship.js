const mongoose = require('mongoose')

const {
  SHIP_ORIENTATION_HORIZONTAL,
  SHIP_ORIENTATION_VERTICAL,
} = require('../../common/helpers/game-mechanics')

const shipSchema = {
  playerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  orientation: {
    type: String,
    required: true,
    enum: [SHIP_ORIENTATION_HORIZONTAL, SHIP_ORIENTATION_VERTICAL]
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
}

module.exports = {
  shipSchema,
}
