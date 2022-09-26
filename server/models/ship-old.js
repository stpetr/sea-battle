const mongoose = require('mongoose')
const {
  SHIP_ORIENTATION_HORIZONTAL,
  SHIP_ORIENTATION_VERTICAL,
} = require('../../common/helpers/game-mechanics')

const MODEL_NAME = 'Ship'

// const createAvailableShip = (width, length, qty, orientation = SHIP_ORIENTATION_HORIZONTAL) => {
//     return {
//         type: `${width}-${length}-${qty}`,
//         width,
//         length,
//         qty,
//         orientation
//     }
// }

const shipSchema = new mongoose.Schema({
  userId: {
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
    enum: [SHIP_ORIENTATION_HORIZONTAL, SHIP_ORIENTATION_VERTICAL],
  },
})

// shipSchema.statics.getAvailableShips = () => ([
//     createAvailableShip(1, 4, 1),
//     createAvailableShip(1, 3, 2),
//     createAvailableShip(1, 2, 3),
//     createAvailableShip(1, 1, 4),
// ])
//
// shipSchema.statics.orientations = {
//     SHIP_ORIENTATION_HORIZONTAL,
//     SHIP_ORIENTATION_VERTICAL,
// }

const Ship = mongoose.model(MODEL_NAME, shipSchema)

module.exports = Ship
