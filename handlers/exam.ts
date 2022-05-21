import { rigidifyQuestion } from "./rigidifyStructures"
import {
    Exam as ExamType,
    QuestionType,
    AnswerTypes,
    ExamAnswer as ExamAnswerType,
    ClassQuestionType,
} from "../types"

export default class Exam {
    private exam!: Question[]

    constructor(parseExam: ExamType) {
        this.exam = parseExam.map((question, index) => {
            return new Question(
                rigidifyQuestion(question, {
                    identifier: (index + 1).toString(),
                })
            )
        })
        checkExam(parseExam).catch((err) => {
            throw err
        })
    }

    getAllQuestions() {
        return this.exam
    }

    getQuestion(index: number) {
        return this.exam[index]
    }
}

export function checkExam(checkExam: ExamType) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(checkExam)) return reject(new Error("Exam must be an array"))
        if (checkExam.length === 0) return reject(new Error("Exam must not be empty"))

        resolve(true)
    })
}

export class Question {
    
    private question!: ClassQuestionType
    
    constructor(question: QuestionType, index?: number) {
        const context: any = {}
        if (!isNaN(index as any)) context.identifier = ((index as number) + 1).toString()

        let standardizedQuestion = rigidifyQuestion(question, context)
        checkQuestion(standardizedQuestion).catch((err) => {
            throw err
        })
        
        const ogAnswer = standardizedQuestion.answer
        standardizedQuestion.answer = new ExamAnswer(ogAnswer)

        this.question = standardizedQuestion as ClassQuestionType
    }

    getidentifier() {
        return this.question.identifier
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

    getScore() {
        return this.question.score as number
    }
}

export class ExamAnswer {
    private answer: ExamAnswerType

    constructor(answer: AnswerTypes | AnswerTypes[] | ExamAnswerType) {
        if (Array.isArray(answer)) {
            this.answer = {
                value: answer,
            }
        } else if (typeof answer === "object") {
            this.answer = answer as ExamAnswer
        } else {
            this.answer = {
                value: answer,
            }
        }
        this.answer.type = typeof this.answer.value
    }

    getAsRaw(): ExamAnswerType {
        return this.answer
    }

    hasMultipleAnswers(): boolean {
        return Array.isArray(this.answer.value)
    }

    get value(): AnswerTypes | AnswerTypes[] {
        return this.answer.value
    }

    isEqualToAnswer(answer: AnswerTypes): boolean {
        if (answer == null) return false
        return (
            (this.hasMultipleAnswers() &&
                (this.value as AnswerTypes[]).includes(answer)) ||
            this.value === answer
        )
    }
}

export function checkQuestion(question: QuestionType, index?: number) {
    return new Promise((resolve, reject) => {
        if (typeof question !== "object") return reject(
            new Error(`Question of index ${index} must be an object`)
        )

        const rigidifiedOptions: any = {}
        if (!isNaN(index as any)) rigidifiedOptions.identifier = ((index as number) + 1).toString()

        const rigidifiedQuestion = rigidifyQuestion(question, rigidifiedOptions)
        const { identifier, statement, influence, answer } = rigidifiedQuestion
            

        if (identifier && typeof identifier !== "string") {
            return reject(
                new Error(
                    `The parameter of "identifier" from question of index ${index} has an invalid statement that is not a string`
                )
            )
        }

        if (statement && typeof statement !== "string"){
            return reject(
                new Error(
                    `The parameter of "statement" from question ${identifier} has an invalid statement that is not a string`
                )
            )
        }

        if (influence && typeof influence !== "object") {
            return reject(
                new Error(
                    `The parameter of "influence" from question ${identifier} has an invalid statement that is not an object`
                )
            )
        }

        if (!rigidifiedQuestion.hasOwnProperty("answer")) {
            return reject(
                new Error(
                    `The parameter of "answer" from question ${identifier} does not exist`
                )
            )
        }
        
        if (!isValidAnswerType(answer.value)) {
            return reject(
                new Error(
                    `The parameter of "answer" from question ${identifier} is not a proper answer value`
                )
            )
        }

        resolve(true)
    })
}

export function isValidAnswerType(answerType: any | AnswerTypes | AnswerTypes[]): boolean {
    if(!Array.isArray(answerType)) answerType = [answerType] as any[]

    return (answerType as any[]).every(
        (a: any) =>
            a == null ||
            typeof a === "string" ||
            typeof a === "boolean"
    )
}