const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

module.exports = {
    io: null,
    socketConnections: {},
    init(io) {
        this.io = io
        io.use((socket, next) => {
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return next(new Error('Authentication error'))
                    }

                    this.socketConnections[socket.id] = String(decoded._id)
                    next()
                })
            } else {
                next(new Error('Authentication error'))
            }
        }).on('connect', (socket) => {
            console.log('somebody has connected', this.socketConnections[socket.id], ', connections number:', Object.keys(this.socketConnections).length)
            socket.join(this.socketConnections[socket.id])

            socket.on('disconnect', () => {
                delete this.socketConnections[socket.id]
                console.log('somebody has disconnected,', 'connections number:', Object.keys(this.socketConnections).length)
            })
        })
    },
    getSocketsByUserId(userId) {
        const sockets = []

        userId = String(userId)
        Object.keys(this.socketConnections).forEach((key) => {
            if (this.socketConnections[key] === userId && this.io.sockets.connected[key]) {
                sockets.push(this.io.sockets.connected[key])
            }
        })

        return sockets
    },
    joinRoom(roomName, userId) {
        this.getSocketsByUserId(userId).forEach((socket) => {
            socket.join(roomName)
            this.io.to(roomName).emit(`joinRoom`, roomName)
            console.log(`you joined ${roomName}`)
        })
    },
    leaveRoom(roomName, userId) {

    },
    notifyUser(userId, event, data) {
        this.io.to(userId).emit(event, data)
    },
    notifyRoom(roomName, event, data) {
        this.io.to(roomName).emit(event, data)
    },
}
