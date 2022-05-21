// models
export type SubjectInfluence = {
    [key: string]: number
}

export type AnswerTypes = string | boolean | null
export interface ExamAnswer {
    type?: string
    value: AnswerTypes | AnswerTypes[]
}
export interface UserAnswer extends ExamAnswer {
    value: AnswerTypes
    override?: {
        score?: number
        influence?: SubjectInfluence
    }
}

export interface QuestionType {
    identifier?: string
    statement?: string
    influence?: SubjectInfluence
    answer: AnswerTypes | AnswerTypes[] | ExamAnswer
    score?: number
}
export interface InternalQuestionType extends QuestionType {
    answer: ExamAnswer
}
export interface ClassQuestionType extends InternalQuestionType {
    answer: import("./handlers/exam").ExamAnswer
}

export type Exam = QuestionType[]
export type Answers = AnswerTypes[]