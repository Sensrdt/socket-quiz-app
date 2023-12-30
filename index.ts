import {Socket} from "./socket/index"

const socketIo = Socket.getSocket()
console.log("Connected")
socketIo.listen(3000)
socketIo.on('connection', (socket) => {
    // once connected need to add users
    console.log(socket)
})

