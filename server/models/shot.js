const mongoose = require('mongoose')
const {
  SHOT_RESULT_KILLED,
  SHOT_RESULT_MISSED,
  SHOT_RESULT_WOUNDED
} = require('../../common/helpers/game-mechanics')

const shotSchema = {
  playerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    enum: [
      SHOT_RESULT_KILLED,
      SHOT_RESULT_MISSED,
      SHOT_RESULT_WOUNDED,
    ],
    immutable: true,
    required: true,
  },
}

module.exports = {
  shotSchema,
}
