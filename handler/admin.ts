import { Quiz } from "../quiz";

let questionId = 0

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

export class Admin {
    private quizes : Quiz[]
    constructor() {
        this.quizes = []
    }

    getQuiz(roomId: string) {
        return this.quizes.find(x => x.roomId === roomId) ?? null;
    }

    addQuiz(roomId: string) {
        console.log("addQuiz")
        const presentRoomId = this.getQuiz(roomId)
        if (presentRoomId) {
            return
        } else {
            const quiz = new Quiz(roomId);
            this.quizes.push(quiz)
        }
    }

    addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name)
    }

    endQuiz(roomId: string, userId: string, submission: 0 | 1 | 2 | 3, question: string) {
        this.getQuiz(roomId)?.endQuiz(userId, roomId, question, submission)
    }

    public start(roomId: string) {
        const quizSession = this.getQuiz(roomId)
        if (!quizSession) {
            return;
        }
        quizSession.startQuiz()
    }

    public addQuestions(roomId: string, question: Question) {
        const quizSession = this.getQuiz(roomId)
        if (quizSession) {
            quizSession.addQuestion({
                ...question,
                id: (questionId++).toString()
            })
        }
    }

    public nextQuestion(roomId: string) {
        const quizSession = this.getQuiz(roomId)
        if (!quizSession) {
            return
        }
        quizSession.nextQuestion()
    }

    getCurrentQuizStatus(roomId: string) {
        const quiz = this.quizes.find(x => x.roomId == roomId)
        if (!quiz) {
            return
        }

        return quiz.getCurrentStatus()
    }
}