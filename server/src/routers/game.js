const express = require('express')
const { GAME_STATUS_FINISHED } = require('@packages/game-mechanics')
const auth = require('../middleware/auth')
// const User = require('../models/user')
const Game = require('../models/game')
const sockets = require('../helpers/sockets')

const router = new express.Router()

router.get('/api/games', auth, async (req, res) => {
  const games = await Game.find({
    $or: [
      { player1: req.user._id },
      { player2: req.user._id },
    ],
  }).exec()

  res.send(games)
})

router.post('/api/game/create-private-game', auth, async (req, res) => {
  try {
    const game = Game.createPrivateGame(req.user._id)
    await game.save()

    const gameData = await Game.prepareGameData(game, req.user)
    res.send(gameData)

    sockets.joinRoom(`game-${game._id}`, req.user._id)
  } catch (e) {
    console.log('Failed to create private game', e)
    res.status(400).send()
  }
})

router.post('/api/game/:id/join', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    return res.status(404).send()
  }

  if (!await game.join(req.user._id)) {
    return res.status(400).send()
  }

  // sockets.joinRoom(`game-${game._id}`, req.user._id)

  const gameData = await Game.prepareGameData(game, req.user)
  res.send(gameData)

  if (gameData.opponent) {
    const opponentGameData = await Game.prepareGameData(game, gameData.opponent)
    sockets.notifyUser(gameData.opponent._id, 'opponentJoined', {
      data: opponentGameData,
      message: 'Opponent has joined the game',
    })
  }
})

router.post('/api/game/:id/set-ships', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    return res.status(404).send()
  }

  /* @todo check also if user participates in the game */

  if (!await game.setShips(req.user._id, req.body)) {
    return res.status(400).send()
  }

  const gameData = await Game.prepareGameData(game, req.user)

  if (gameData.opponent) {
    const opponentGameData = await Game.prepareGameData(game, gameData.opponent)
    sockets.notifyUser(gameData.opponent._id, 'opponentSetShips', {
      data: opponentGameData,
      message: 'Opponent has set his ships',
    })
  }

  res.send(gameData)
})

router.post('/api/game/:id/make-shot', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    return res.status(404).send()
  }

  /* @todo check also if user participates in the game */

  if (!await game.makeShot(req.user._id, req.body.row, req.body.col)) {
    return res.status(400).send()
  }

  let gameData = await Game.prepareGameData(game, req.user)
  let opponentGameData = await Game.prepareGameData(game, gameData.opponent)

  sockets.notifyUser(gameData.opponent._id, `makeShot`, { message: `The shot has been made`, data: opponentGameData })

  if (game.isPlayerWon(req.user._id)) {
    game.gameOver(req.user._id)
    gameData = await Game.prepareGameData(game, req.user)
    opponentGameData = await Game.prepareGameData(game, gameData.opponent)
    sockets.notifyUser(gameData.opponent._id, `gameOver`, { message: `You've lost`, data: opponentGameData })
  }

  res.send(gameData)
})

router.post('/api/game/:id/request-revanche', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    return res.status(404).send()
  }

  if (game.status !== GAME_STATUS_FINISHED) {
    return res.status(400).send()
  }

  const gameData = await Game.prepareGameData(game, req.user)

  console.log('GDATA', gameData.opponent._id)

  sockets.notifyUser(gameData.opponent._id, 'requestRevanche', {
    data: {
      gameId: game._id
    },
    message: 'Revanche?',
  })
})

router.post('/api/game/:id/accept-revanche', auth, async (req, res) => {
  const currentGame = await Game.findById(req.params.id)

  if (!currentGame) {
    return res.status(404).send()
  }

  if (currentGame.status !== GAME_STATUS_FINISHED) {
    return res.status(400).send()
  }

  const currentGameData = await Game.prepareGameData(currentGame, req.user)
  try {
    const revancheGame = Game.createPrivateGame(req.user._id, currentGameData.opponent._id)
    await revancheGame.save()

    const revancheGameData = await Game.prepareGameData(revancheGame, req.user)
    res.send(revancheGameData)
    console.log('Notifying about accepted revanche', Object.keys(currentGameData))
    sockets.notifyUser(currentGameData.opponent._id, 'revancheAccepted', {
      data: revancheGameData,
      message: 'Let us play again',
    })
    sockets.notifyUser(currentGameData.player._id, 'revancheAccepted', {
      data: revancheGameData,
      message: 'Let us play again',
    })
  } catch (e) {
    console.log('Failed to create game for revanche', e)
    res.status(400).send()
  }
})

router.post('/api/game/:id/leave', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    return res.status(404).send()
  }

  /* @todo check also if user participates in the game */

  if (!await game.leave(req.user._id)) {
    return res.status(400).send()
  }

  let gameData = await Game.prepareGameData(game, req.user)
  let opponentGameData = await Game.prepareGameData(game, gameData.opponent)

  sockets.notifyUser(gameData.opponent._id, `makeShot`, { message: `The shot has been made`, data: opponentGameData })

  if (game.isPlayerWon(req.user._id)) {
    game.gameOver(req.user._id)
    gameData = await Game.prepareGameData(game, req.user)
    opponentGameData = await Game.prepareGameData(game, gameData.opponent)
    sockets.notifyUser(gameData.opponent._id, `gameOver`, { message: `You've lost`, data: opponentGameData })
  }

  res.send(gameData)
})

router.get('/api/game/private/:id', auth, async (req, res) => {
  const game = await Game.findById(req.params.id)

  if (!game) {
    res.status(404)
  }

  const gameData = await Game.prepareGameData(game, req.user)
  res.send(gameData)
})

module.exports = router
