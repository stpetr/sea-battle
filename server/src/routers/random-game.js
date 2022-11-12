const express = require('express')
const auth = require('../middleware/auth')
const Game = require('../models/game')
const sockets = require('../helpers/sockets')

const router = new express.Router()

const players = []

router.post('/api/random-game/check-in', auth, async (req, res) => {
  console.log('checkin for random game', players, req.user._id)

  const playerAlreadyWaiting = players.some((playerId) => req.user._id.equals(playerId))
  if (playerAlreadyWaiting) {
    return res.send({ result: 'failed' })
  }

  if (players.length) {
    const opponentUserId = players.shift()
    const game = Game.createRandomGame([req.user._id, opponentUserId])
    await game.save()

    sockets.notifyUser(req.user._id, 'randomGameReady', game)
    sockets.notifyUser(opponentUserId, 'randomGameReady', game)

    console.log('Random game created. players waiting:', players.length)
  } else {
    console.log('Player was put into the awaiting list')
    players.push(req.user._id)
  }

  res.send({ result: 'ok' })
})

router.post('/api/random-game/check-out', auth, async (req, res) => {
  const playerIndex = players.findIndex((playerId) => req.user._id.equals(playerId))
  if (playerIndex > -1) {
    players.splice(playerIndex, 1)
    console.log('Player was removed from the awaiting list')
  } else {
    console.log('Player was not in the awaiting list')
  }

  res.send({ result: 'ok' })
})

module.exports = router
