import {
    getAllAnswerScores,
    getAllSubjects,
    getAverageScore,
    getIndividualScores,
} from "../handlers/analyzer"
import type Exam from "../handlers/exam"
import type { UserAnswer } from "../handlers/answers"
import limitCharacters from "./limitCharacters"
import { terminal as term } from "terminal-kit"

export function generalScores(answers: { [user: string]: UserAnswer }, exam: Exam) {
    const userScores = getAllAnswerScores(answers, exam)

    return [
        [
            "Answer's name",
            "Percentage of correct answers",
            ...getAllSubjects(exam),
        ],
        ...Object.entries(answers).map(([username, answers]) => [
            username,
            `${(
                (answers.getAllAnswers().reduce((acc, answer, index) => {
                    if (exam.getQuestion(index).isEqualToAnswer(answer)) acc++
                    return acc
                }, 0) /
                    exam.getAllQuestions().length) *
                100
            ).toFixed(2)}%`,
            ...Object.values(userScores[username]).map(
                ({ sumOfCorrect, sumOfAll }) =>
                    `${((sumOfCorrect / sumOfAll) * 100).toFixed(2)}%`
            ),
        ]),
        [
            "Average",
            (
                (Object.entries(answers).reduce( (acc, [username, response], index) => {
                    response.getAllAnswers().forEach((answer, index) => {
                        if (exam.getQuestion(index).isEqualToAnswer(answer)) {
                            acc++
                        }
                    })
                    return acc
                }, 0) / (exam.getAllQuestions().length * Object.entries(answers).length)) * 100
            ).toFixed(2) + "%",
            ...getAllSubjects(exam).map(
                (subject) =>
                    `${(getAverageScore(userScores, subject) * 100).toFixed(
                        2
                    )}%`
            ),
        ],
    ]
}

export function individualAnswers(answer: UserAnswer, exam: Exam) {
    const userSumScore = getIndividualScores(answer, exam)
    const subjects = getAllSubjects(exam)

    return [
        ["Question", "Correct answers", ...subjects],
        ...exam
            .getAllQuestions()
            .map((question, index) => [
                `${index + 1}. ${limitCharacters(
                    question.getStatement() ?? "",
                    Math.floor(term.width * 0.15)
                )}`,
                question.isEqualToAnswer(answer.getAnswer(index)) ? "✅" : (
                    answer.getAnswer(index) == null ? "➖" : "❌"
                ),
                ...subjects.map((subject) =>
                    question.getInfluencedSubjects()?.[subject] &&
                    question.isEqualToAnswer(answer.getAnswer(index))
                        ? `${
                              question.getInfluencedSubjects()?.[subject] ??
                              0 * 100
                          }%`
                        : undefined
                ),
            ]),
        [
            "Sum of correct answers",
            `${(
                (exam.getAllQuestions().reduce((sum, question, index) => {
                    if (question.isEqualToAnswer(answer.getAnswer(index))) {
                        return sum + 1
                    }
                    return sum
                }, 0) /
                    exam.getAllQuestions().length) *
                100
            ).toFixed(2)}%`,
            ...Object.values(userSumScore).map(
                ({ sumOfCorrect, sumOfAll }) =>
                    `${((sumOfCorrect / sumOfAll) * 100).toFixed(2)}%`
            ),
        ],
    ]
}