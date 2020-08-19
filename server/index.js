const cors = require(`cors`)
const express = require('express')
const http = require('http')
const path = require('path')
const socketIo = require('socket.io')
const userRouter = require('./routers/user')

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

app.get('*', (req, res, next) => {
    res.sendFile(path.join(publicDirectoryPath, 'index.html'))
})

app.listen(PORT, () => {
    console.log('Server is up on port', PORT)
})
