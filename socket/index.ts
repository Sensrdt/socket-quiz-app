import http from "http"
import { Server } from "socket.io";
const server = http.createServer()

export class Socket {
    private static socket : Server;

    public static getSocket() {
        if (!this.socket) {
            const socketIo = new Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            })
            this.socket= socketIo
        }

        return this.socket
    }
}