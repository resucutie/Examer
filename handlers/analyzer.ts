import type { UserAnswer } from "./answers"
import type Exam from "./exam"

export const getIndividualScores = (answers: UserAnswer, exam: Exam) => {
    const userScore: UserScore = {}

    for (let i = 0; i < exam.getAllQuestions().length; i++) {
        const question = exam.getQuestion(i)
        const answer = answers.getAnswer(i)

        const subjects = question.getInfluencedSubjects()
        for (const subject in subjects) {
            if (!userScore[subject]) {
                userScore[subject] = {
                    sumOfCorrect: 0,
                    sumOfAll: 0,
                }
            }
            userScore[subject].sumOfAll += subjects[subject]
            if (question.isEqualToAnswer(answer)) {
                userScore[subject].sumOfCorrect += subjects[subject]
            }
        }
    }
    return userScore
}

export const getAllAnswerScores = (
    answers: { [user: string]: UserAnswer },
    exam: Exam
) => {
    const userScores: { [user: string]: UserScore } = {}
    for (const username in answers) {
        userScores[username] = getIndividualScores(answers[username], exam)
    }

    return userScores as { [user: string]: UserScore }
}

export function getAllSubjects(
    exam: Exam
) {
    const subjectList: string[] = []
    for (let i = 0; i < exam.getAllQuestions().length; i++) {
        const question = exam.getQuestion(i)

        const subjects = question.getInfluencedSubjects()
        for (const subject in subjects) {
            if (!subjectList.includes(subject)) subjectList.push(subject)
        }
    }

    return subjectList
}

export function getAverageScore(
    userScores: { [user: string]: UserScore },
    subject: string
) {
    let sum = 0
    let count = 0
    for (const user in userScores) {
        const score = userScores[user][subject]
        if (score) {
            sum += score.sumOfCorrect
            count += score.sumOfAll
        }
    }
    return sum / count
}

export interface SubjectScore {
    sumOfCorrect: number
    sumOfAll: number
}

export interface UserScore {
    [subject: string]: SubjectScore
}