import { terminal as term } from "terminal-kit"
import ExcelJS from "exceljs"

import {
    getAllAnswerScores,
    getAllSubjects,
    getAverageSubjectScore,
    getIndividualScores,
} from "../handlers/analyzer"
import type Exam from "../handlers/exam"
import type { UserAnswer } from "../handlers/answers"
import limitCharacters from "./limitCharacters"

export function generalScores(answers: { [user: string]: UserAnswer }, exam: Exam) {
    const userScores = getAllAnswerScores(answers, exam)

    return [
        [
            "Answer's name",
            "Score",
            "Percentage of correct answers",
            ...getAllSubjects(exam),
        ],
        ...Object.entries(answers).map(([username, answers]) => [
            username,
            answers
                .getAllAnswers()
                .reduce((acc, answer, index) => {
                    if (
                        exam
                            .getQuestion(index)
                            .getAnswer()
                            .isEqualToAnswer(answer.value)
                    )
                        acc += exam.getQuestion(index).getScore()
                    return acc
                }, 0)
                .toFixed(2),
            (
                (answers.getAllAnswers().reduce((acc, answer, index) => {
                    if (
                        exam
                            .getQuestion(index)
                            .getAnswer()
                            .isEqualToAnswer(answer.value)
                    )
                        acc++
                    return acc
                }, 0) /
                    exam.getAllQuestions().length) *
                100
            ).toFixed(2) + "%",
            ...Object.values(userScores[username]).map(
                ({ sumOfCorrect, sumOfAll }) =>
                    `${((sumOfCorrect / sumOfAll) * 100).toFixed(2)}%`
            ),
        ]),
        [
            "Average",
            (Object.entries(answers).reduce((acc, [username, response], index) => {
                response.getAllAnswers().forEach((answer, index) => {
                    if (
                        exam
                            .getQuestion(index)
                            .getAnswer()
                            .isEqualToAnswer(answer.value)
                    ) {
                        acc += exam.getQuestion(index).getScore()
                    }
                })
                return acc
            }, 0) / exam.getAllQuestions().length).toFixed(2),
            (
                (Object.entries(answers).reduce(
                    (acc, [username, response], index) => {
                        response.getAllAnswers().forEach((answer, index) => {
                            if (
                                exam
                                    .getQuestion(index)
                                    .getAnswer()
                                    .isEqualToAnswer(answer.value)
                            ) {
                                acc++
                            }
                        })
                        return acc
                    },
                    0
                ) /
                    (exam.getAllQuestions().length *
                        Object.entries(answers).length)) *
                100
            ).toFixed(2) + "%",
            ...getAllSubjects(exam).map(
                (subject) =>
                    (getAverageSubjectScore(userScores, subject) * 100).toFixed(2) +
                    "%"
            ),
        ],
    ]
}

export function individualAnswers(answer: UserAnswer, exam: Exam) {
    const userSumScore = getIndividualScores(answer, exam)
    const subjects = getAllSubjects(exam)

    return [
        ["Question", "Score", "Correct answers", ...subjects],
        ...exam.getAllQuestions().map((question, index) => [
            `${question.getidentifier()}. ${limitCharacters(
                question.getStatement() ?? "",
                Math.floor(term.width * 0.15)
            )}`,
            answer.getAnswer(index).override?.hasOwnProperty("score")
                ? answer.getAnswer(index).override?.score
                : question
                      .getAnswer()
                      .isEqualToAnswer(answer.getAnswer(index).value)
                ? question.getScore()
                : null,
            question.getAnswer().isEqualToAnswer(answer.getAnswer(index).value)
                ? "√"
                : answer.getAnswer(index) == null
                ? "-"
                : "X",
            ...subjects.map((subject) => {
                if (answer.getAnswer(index).override?.influence?.[subject]) {
                    return answer.getAnswer(index).override?.influence?.[
                        subject
                    ]
                }
                if (question.getInfluencedSubjects()?.[subject]) {
                    return question
                        .getAnswer()
                        .isEqualToAnswer(answer.getAnswer(index).value)
                        ? question.getInfluencedSubjects()?.[subject] ?? 0 * 100
                        : undefined
                }
            }),
        ]),
        [
            "Average",
            exam.getAllQuestions().reduce((sum, question, index) => {
                if (answer.getAnswer(index).override?.hasOwnProperty("score")) {
                    return sum + Number(answer.getAnswer(index).override?.score)
                } else if (
                    question
                        .getAnswer()
                        .isEqualToAnswer(answer.getAnswer(index).value)
                ) {
                    return sum + question.getScore()
                }
                return sum
            }, 0),
            (
                (exam.getAllQuestions().reduce((sum, question, index) => {
                    if (
                        question
                            .getAnswer()
                            .isEqualToAnswer(answer.getAnswer(index).value)
                    ) {
                        return sum + 1
                    }
                    return sum
                }, 0) /
                    exam.getAllQuestions().length) *
                100
            ).toFixed(2) + "%",
            ...Object.entries(userSumScore).map(
                ([subject, { sumOfCorrect, sumOfAll }]) => {
                    return `${((sumOfCorrect / sumOfAll) * 100).toFixed(2)}%`
                }
            ),
        ],
    ]
}

export function toExcelJS(table: Array<Array<any>>, existingWorksheet?: ExcelJS.Workbook) {
    const stringifiedTable = table.map((rows) =>
        rows.map((ceil) => (ceil == null ? "" : ceil))
    )

    const workbook = existingWorksheet ?? new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Table")
    
    sheet.addRows(stringifiedTable)

    return workbook
}

export default {
    generalScores,
    individualAnswers,
    toExcelJS,
}