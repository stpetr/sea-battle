const mongoose = require('mongoose')
const Ship = require('./ship')
const User = require('./user')
const { shipSchema } = require('./ship')
const { shotSchema } = require('./shot')

const {
  BATTLEFIELD_SIZE,
  PLAYERS_NUMBER,
  GAME_TYPE_PRIVATE,
  GAME_TYPE_RANDOM,
  GAME_STATUS_JOIN,
  GAME_STATUS_SET,
  GAME_STATUS_PLAY,
  GAME_STATUS_FINISHED,
  SHIP_ORIENTATION_HORIZONTAL,
  SHIP_ORIENTATION_VERTICAL,
  SHIP_STATUS_KILLED,
  SHIP_STATUS_WOUNDED,
  SHOT_RESULT_KILLED,
  SHOT_RESULT_MISSED,
  SHOT_RESULT_WOUNDED,
  getAvailableShips,
  getShipByCoords,
  getShipCellsCoords,
  validateShips,
  isCoordsValid,
} = require('@packages/game-mechanics')

const MODEL_NAME = 'Game'

const gameSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [GAME_TYPE_PRIVATE, GAME_TYPE_RANDOM],
  },
  players: [{
    type: mongoose.Types.ObjectId,
    ref: User,
  }],
  nextMove: {
    type: mongoose.Types.ObjectId,
    ref: User,
    validate: {
      validator: function (value) {
        console.log(`Next move is changing from ${this.nextMove} to ${value}`)
        const player = this.players.find((_id) => value.equals(_id))
        if (typeof player === 'undefined') {
          return false
        }
        return true
      },
      message: 'Next move player is not valid',
    },
  },
  ships: [shipSchema],
  shots: [shotSchema],
  status: {
    type: String,
    required: true,
    enum: [GAME_STATUS_JOIN, GAME_STATUS_SET, GAME_STATUS_PLAY, GAME_STATUS_FINISHED],
    default: GAME_STATUS_JOIN,
    validate: function (value) {
      if (value === GAME_STATUS_SET) {
        return this.players.length === PLAYERS_NUMBER
      }
    },
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
})

gameSchema.statics.types = {
  GAME_TYPE_RANDOM,
  GAME_TYPE_PRIVATE,
}

gameSchema.statics.statuses = {
  GAME_STATUS_JOIN,
  GAME_STATUS_SET,
  GAME_STATUS_PLAY,
  GAME_STATUS_FINISHED,
}

gameSchema.statics.createPrivateGame = (userId, opponentId = null) => {
  const players = [userId]

  if (opponentId) {
    players.push(opponentId)
  }

  const gameData = {
    type: GAME_TYPE_PRIVATE,
    players,
    status: GAME_STATUS_JOIN,
  }

  return new mongoose.model(MODEL_NAME)(gameData)
}

gameSchema.statics.createRandomGame = (userIds) => {
  if (!Array.isArray(userIds) || userIds.length !== PLAYERS_NUMBER) {
    return false
  }

  const gameData = {
    type: GAME_TYPE_RANDOM,
    players: [...userIds],
    status: GAME_STATUS_SET,
  }

  return new mongoose.model(MODEL_NAME)(gameData)
}

gameSchema.statics.prepareGameData = async (game, user) => {
  const gameData = {
    _id: game._id,
    type: game.type,
    constants: gameSchema.statics.getGameConstants(),
    shots: game.shots,
    nextMove: game.nextMove,
    status: game.status,
  }

  const player = game.getPlayer(user._id)
  const opponent = game.getOpponent(user._id)

  if (player) {
    gameData.player = user.toObject()
  } else {
    gameData.status = GAME_STATUS_JOIN
    return gameData
  }

  if (opponent) {
    gameData.opponent = await User.findById(opponent)
  }

  const playerShips = game.getPlayerShips(user._id)
  const opponentKilledShips = game.getOpponentShips(user._id).filter(({ status }) => status === SHIP_STATUS_KILLED)
  if (playerShips.length) {
    gameData.ships = playerShips
    gameData.status = GAME_STATUS_PLAY
    gameData.opponentKilledShips = opponentKilledShips
    // if (game.getOpponentShips(user._id).length) {
    //     gameData.status = GAME_STATUS_PLAY
    // } else {
    //     gameData.status = GAME_STATUS_SET
    // }
  } else {
    gameData.status = GAME_STATUS_SET
    gameData.availableShips = getAvailableShips()
  }

  if (game.status === GAME_STATUS_FINISHED) {
    gameData.winner = game.winner
  }

  return gameData
}

gameSchema.statics.getGameConstants = () => ({
  BATTLEFIELD_SIZE,
  ...gameSchema.statics.types,
  ...gameSchema.statics.statuses,
  ...{ SHIP_ORIENTATION_HORIZONTAL, SHIP_ORIENTATION_VERTICAL },
})

gameSchema.methods.isPlayerValid = function (userId) {
  return typeof this.players.find((_id) => userId.equals(_id)) !== 'undefined'
}

gameSchema.methods.getPlayer = function (userId) {
  return this.players.find((_id) => userId.equals(_id))
}

gameSchema.methods.getOpponent = function (userId) {
  return this.players.find((_id) => !userId.equals(_id))
}

gameSchema.methods.getPlayerShips = function (userId) {
  return this.ships.filter(({ playerId }) => userId.equals(playerId))
}

gameSchema.methods.getOpponentShips = function (userId) {
  return this.ships.filter(({ playerId }) => !userId.equals(playerId))
}

gameSchema.methods.getPlayerShots = function (userId) {
  return this.shots.filter(({ playerId }) => userId.equals(playerId))
}

gameSchema.methods.getOpponentShots = function (userId) {
  return this.shots.filter(({ playerId }) => !userId.equals(playerId))
}

gameSchema.methods.isShipKilled = function (ship, shots) {
  const cellsCoords = getShipCellsCoords(ship)
  const cells = cellsCoords.reduce((map, { row, col }) => {
    const key = [row, col].join(',')
    map[key] = false
    return map
  }, {})

  shots.forEach(({ row, col }) => {
    const key = [row, col].join(',')
    if (typeof cells[key] !== 'undefined') {
      cells[key] = true
    }
  })

  return Object.values(cells).filter((value) => value === false).length === 0
}

gameSchema.methods.setNextMove = function () {
  if (!this.nextMove) {
    const index = Math.random() > .5 ? 1 : 0
    this.nextMove = this.players[index]
    console.log(`Set random next move to ${this.nextMove}`)
  } else {
    console.log(`Switch next move from ${this.nextMove} to ${this.getOpponent(this.nextMove)}`)
    this.nextMove = this.getOpponent(this.nextMove)
  }
}

gameSchema.methods.join = function (userId) {
  if (this.players.length >= PLAYERS_NUMBER) {
    return false
  }

  const player = this.players.find(({ _id }) => userId.equals(_id))
  if (player) {
    return true
  }

  this.players.push(userId)

  if (this.players.length === PLAYERS_NUMBER && this.status === GAME_STATUS_JOIN) {
    this.status = GAME_STATUS_SET
  }

  return this.save()
}

gameSchema.methods.setShips = async function (userId, ships) {
  if (this.getPlayerShips(userId).length > 0) {
    return false
  }

  if (!validateShips(ships)) {
    return false
  }

  ships.forEach((ship) => {
    ship.playerId = userId
  })

  this.ships.push(...ships)

  if (this.getOpponentShips(userId).length > 0) {
    this.status = GAME_STATUS_PLAY
    this.setNextMove()
  }

  return this.save()
}

gameSchema.methods.makeShot = async function (playerId, row, col) {
  if (!isCoordsValid(row, col)) {
    console.log('Shot coords are invalid', row, col)
    return false
  }

  if (!playerId.equals(this.nextMove)) {
    console.log('Player cannot shoot when it is not their turn')
    return false
  }

  const hasSameCoordsShot = this.getPlayerShots(playerId).some(({
    row: shotRow,
    col: shotCol,
  }) => shotRow === row && shotCol === col)

  if (hasSameCoordsShot) {
    console.log('Cannot shoot at the same cell twice')
    return false
  }

  const shipByCoords = getShipByCoords(this.getOpponentShips(playerId), row, col)
  let result = SHOT_RESULT_MISSED
  if (shipByCoords) {
    const wasShipKilled = this.isShipKilled(shipByCoords, [...this.getPlayerShots(playerId), { row, col }])

    if (wasShipKilled) {
      shipByCoords.status = SHIP_STATUS_KILLED
      result = SHOT_RESULT_KILLED
    } else {
      shipByCoords.status = SHIP_STATUS_WOUNDED
      result = SHOT_RESULT_WOUNDED
    }
  }

  this.shots.push({
    playerId,
    row,
    col,
    result,
  })

  console.log('Shot result:', result)

  if (result === SHOT_RESULT_MISSED) {
    this.setNextMove()
  }

  // √ check if the shot missed or not +
  // √ if the shot was successful check if it killed the ship or just wounded +
  // √ send appropriate response
  // √ notify opponent about the shot
  // check if game has ended

  if (this.isPlayerWon(playerId)) {
    console.log('Player won')
  }

  return this.save()
}

gameSchema.methods.isPlayerWon = function (playerId) {
  const successfulShotResults = [SHOT_RESULT_WOUNDED, SHOT_RESULT_KILLED]
  const totalShipCellsNum = this.getPlayerShips(playerId).reduce((accumulator, {
    width,
    length,
  }) => accumulator + width * length, 0)
  const playerSuccessfulShotsNum = this.getPlayerShots(playerId).reduce((accumulator, { result }) => {
    if (successfulShotResults.includes(result)) {
      return accumulator + 1
    }
    return accumulator
  }, 0)

  return playerSuccessfulShotsNum === totalShipCellsNum
}

gameSchema.methods.gameOver = async function (playerId) {
  if (this.isPlayerWon(playerId)) {
    this.status = GAME_STATUS_FINISHED
    this.isFinished = true
    this.winner = this.getPlayer(playerId)

    return this.save()
  }
}

gameSchema.methods.leave = async function (playerId) {
  this.isFinished = true
  return this.save()
}

const Game = mongoose.model(MODEL_NAME, gameSchema)

module.exports = Game
