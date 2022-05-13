import { Questionnaire, Question as QuestionType, AnswerType } from "../types"

export default class Exam {
    private exam: Question[]

    constructor(exam: Questionnaire) {
        this.exam = exam.map(question => new Question(question))
    }

    getAllQuestions() {
        return this.exam
    }

    getQuestion(index: number) {
        return this.exam[index]
    }
}

export class Question {
    private question: QuestionType
    constructor(question: QuestionType) {
        this.question = question
    }

    getAsRaw() {
        return this.question
    }

    getStatement() {
        return this.question.statement
    }

    getInfluencedSubjects() {
        return this.question.influence
    }

    getAnswer() {
        return this.question.answer
    }

    isEqualToAnswer(answer: AnswerType) {
        if (answer === null || answer === undefined) return false
        return (
            (Array.isArray(this.getAnswer()) &&
                (this.getAnswer() as AnswerType[]).includes(answer)) ||
            this.getAnswer() === answer
        )
    }
}