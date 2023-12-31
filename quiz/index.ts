import { Socket } from "../socket";

interface Submission {
    questionId: string
    userId: string
    answer: 0 | 1 | 2 | 3
    isRight: boolean
}

interface Question {
    id : string;
    question: string;
    questionDescription: string;
    answer: 0 | 1 | 2 | 3;
    options: {
        id: number;
        question: string;
    }[]
    submissions: Submission[]
    timerStartTime: number
}

interface User {
    name: string
    id: string
    score: number
}

export class Quiz {
    private users: User[]
    private questions: Question[]
    public roomId: string
    private quizStarted: boolean
    private currentState: "leaderboard" | "question" | "not_started" | "ended";
    private currentQuestion = 0;

    constructor(roomId: string) {
        this.roomId = roomId
        this.quizStarted = false
        this.users = []
        this.questions = []
        this.currentState = "not_started";

        setInterval(() => {
            this.debug();
        }, 20000)
    }

    // debug
    debug() {
        console.log("----debug---")
        console.log(this.roomId)
        console.log(JSON.stringify(this.questions))
        console.log(this.users)
        console.log(this.currentState)
        console.log(this.currentQuestion);
    }

    // start and end quiz
    startQuiz() {
        this.quizStarted = true
        this.setCurrentQuestion(this.questions[0])
    }

    // end or submit quiz
    endQuiz(userId: string, roomId: string, questionId: string, submission: 0 | 1| 2 |3) {
        const question = this.questions.find(i => i.id == questionId)
        const user = this.users.find(i => i.id == userId)

        if (!user || !question) {
            return;
        }

        // adding submission
        question?.submissions.push({
            questionId,
            userId,
            isRight: submission === question.answer,
            answer: submission
        })

        // add score to user
        if ((new Date().getTime() - question.timerStartTime)/1000 < 21 ) {
            if (question.answer === submission) user.score += 1
        }
    }

    // add a user
    addUser(name: string) {
        let userID = (Math.random() * 1000000).toString()
        this.users.push({
            id: userID,
            name,
            score: 0
        })

        return userID
    }

    // add a question
    addQuestion(question: Question) {
        this.questions.push(question)
    }

    // move to next question
    nextQuestion() {
        this.currentQuestion++
        const question = this.questions[this.currentQuestion]
        if (question) {
            this.setCurrentQuestion(question)
        } else {
            this.currentQuestion--;
        }
    }

    // set current question
    setCurrentQuestion(question: Question) {
        this.currentState = "question"
        question.timerStartTime = new Date().getTime();
        question.submissions = []
        Socket.getSocket().to(this.roomId).emit("question", {
            question
        })
    }

    // send leaderboard to the connection
    sendLeaderboard() {
        this.currentState = "leaderboard"
        const leaderboard = this.getLeaderboard()
        Socket.getSocket().to(this.roomId).emit("leaderboard", {
            leaderboard
        })
    }

    // get leaderboard details
    getLeaderboard() {
        return this.users.sort((a, b) => a.score < b.score ? 1 : -1).slice(0, 20);;
    }

    // get current status of the game
    getCurrentStatus() {
        if (this.currentState == "not_started") {

            return {
                type: "not_started"
            }

        } else if (this.currentState == "ended") {

            return {
                type: "ended"
            }

        } else if (this.currentState == "question") {
            return {
                type: "question",
                question: this.questions[this.currentQuestion]
            }

        } else if (this.currentState == "leaderboard") {
            return {
                type: "leaderboard",
                question: this.getLeaderboard()
            }
        }
    }
}