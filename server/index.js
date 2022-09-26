const cors = require(`cors`)
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const path = require('path')
const socketIo = require('socket.io')
const sockets = require('./helpers/sockets')
const userRouter = require('./routers/user')
const gameRouter = require('./routers/game')
const gameStackRouter = require('./routers/random-game')

require('./db/mongoose')

const PORT = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

app.use(cors())
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(userRouter)
app.use(gameRouter)
app.use(gameStackRouter)

app.get('/api/*', (req, res) => {
  res.status(404).send()
})

app.get('*', (req, res, next) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'))
})

sockets.init(io)

// const socketConnections = {}
//
// io.use((socket, next) => {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return next(new Error('Authentication error'))
//       }
//
//       socketConnections[socket.id] = decoded._id
//       next()
//     })
//   } else {
//     next(new Error('Authentication error'))
//   }
// }).on('connect', (socket) => {
//   console.log('somebody has connected', socketConnections[socket.id], ', connections number:', Object.keys(socketConnections).length)
//   socket.join(socketConnections[socket.id])
//
//
//   socket.on('disconnect', () => {
//     delete socketConnections[socket.id]
//     console.log('somebody has disconnected,', 'connections number:', Object.keys(socketConnections).length)
//   })
// })

httpServer.listen(PORT, () => {
  console.log('Server is up on port', PORT)
})
