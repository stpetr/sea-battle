import socketIOClient from 'socket.io-client'
import { getServerUrl } from './url'

export default {
  socket: null,
  connect() {
    this.socket = socketIOClient(getServerUrl(), {
      query: {
        token: localStorage.getItem('token'),
      },
    })
  },
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    } else {
      console.log(`Couldn't bind socket event listener "${event}"`)
    }
  },
}
