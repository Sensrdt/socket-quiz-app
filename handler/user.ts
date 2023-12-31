import { Socket } from "socket.io";
import { Admin } from "./admin";

export class Users {
    private adminManager;
    constructor() {
        this.adminManager = new Admin
    }

    public addUsers(socket: Socket) {
        socket.on("user", (data) => {
            const userId = this.adminManager.addUser(data.roomId, data.name)
            socket.emit("init", {
                userId,
                state: this.adminManager.getCurrentQuizStatus(data.roomId)
            })

            socket.join(data.roomId)
        })

        socket.on("admin", (data) => {
            if (data.admin_code != "123qweasd") {
                return
            }

            socket.on("addQuiz", data => {
                this.adminManager.addQuiz(data.roomId)
            })

            socket.on("createQuestion", (data) => {
                this.adminManager.addQuestions(data.roomId, data.question)
            })

            socket.on("nextQuestion", (data) => {
                this.adminManager.nextQuestion(data.roomId)
            })
        })

        socket.on("end", (data) => {
            this.adminManager.endQuiz(data.roomId, data.userId, data.submission, data.question)
        })
    }
}