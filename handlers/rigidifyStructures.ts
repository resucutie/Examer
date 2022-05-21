import { QuestionType, InternalQuestionType, ExamAnswer, UserAnswer, AnswerTypes } from "../types"

interface RigidifyQuestionContext {
    identifier?: string
}
export function rigidifyQuestion(
    question: QuestionType,
    context: RigidifyQuestionContext
): InternalQuestionType {
    if (typeof question.answer !== 'object') {
        const oldval = question.answer
        question.answer = {
            type: typeof oldval,
            value: oldval
        } as ExamAnswer
    }
    if(!question.hasOwnProperty('score')) {
        question.score = 1
    }

    return Object.assign({}, context, question) as InternalQuestionType
}

export function rigidifyUserAnswer(
    answer: UserAnswer | AnswerTypes | AnswerTypes[]
): UserAnswer {
    let certifiedAnswer: UserAnswer = answer as UserAnswer
    
    if (Array.isArray(answer) || answer == null || typeof answer !== "object") {
        certifiedAnswer = {
            type: typeof answer,
            value: answer,
        } as UserAnswer
    }
    
    if (!certifiedAnswer.hasOwnProperty("value"))
        throw new Error("Answer must have a value")
    
    certifiedAnswer.type = typeof certifiedAnswer.value

    return certifiedAnswer
}
