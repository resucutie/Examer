import path from "path"
import fs from "fs/promises"
import Exam from "./handlers/exam";
import { Questionnaire } from "./types";
import { getUserAnswers } from "./handlers/answers";
//@ts-ignore
import { terminal as term, TextTable, Element } from "terminal-kit"
import { Range } from "./types"

const userbaseData = path.join(__dirname, "data")
const examPath = path.join(userbaseData, "exam.json")
const getExamContents = async () =>
    JSON.parse(await fs.readFile(examPath, "utf8")) as unknown as Questionnaire

const mainRender = async () => {
    term.bold.underline.green("Examer v0.0.1\n\n")
    term("Using ")
        .underline(
            path.join(
                path.parse(process.cwd()).root,
                path.relative(path.parse(process.cwd()).root, path.join(userbaseData, "users"))
            )
        )(" as the answers data and ")
        .underline(
            path.join(
                path.parse(process.cwd()).root,
                path.relative(path.parse(process.cwd()).root, examPath)
            )
        )(" as the exam file\n")

    const answers = await getUserAnswers(path.join(userbaseData, "users"))
    const exam = new Exam(await getExamContents())

    term("Found ").bold(Object.keys(answers).length)(" answers\n")

    const userScore: {[user: string]: Object} = {}
    const subjectList: string[] = []
    for (const username in answers) {
        term("Calculating from ")(username)("\n")
        const user = answers[username]

        let sum: {[subject: string]: {
            sumOfCorrect: number,
            sumOfAll: number
        }} = {}

        for (let i = 0; i < exam.getAllQuestions().length; i++) {
            const question = exam.getQuestion(i)
            const answer = user.getAnswer(i)

            const subjects = question.getInfluencedSubjects()
            for (const subject in subjects) {
                if (!sum[subject]) {
                    sum[subject] = {
                        sumOfCorrect: 0,
                        sumOfAll: 0
                    }
                }
                if (!subjectList.includes(subject)) subjectList.push(subject)
                sum[subject].sumOfAll += subjects[subject]
                if (question.isEqualToAnswer(answer)) {
                    sum[subject].sumOfCorrect += subjects[subject]
                }
            }
        }

        userScore[username] = sum
    }

    let averageSubjectScores: {
        [subject: string]: {
            sumOfCorrect: number
            sumOfAll: number
        }
    } = {}
    for (const subject of subjectList) {
        averageSubjectScores[subject] = {
            sumOfCorrect: 0,
            sumOfAll: 0
        }
        Object.entries(userScore).forEach(([, score]) => {
            Object.values(score).forEach(({ sumOfCorrect, sumOfAll }) => {
                averageSubjectScores[subject].sumOfCorrect += sumOfCorrect
                averageSubjectScores[subject].sumOfAll += sumOfAll
            })
        })
    }


    //@ts-ignore
    term.table(
        [
            ["User", ...subjectList],
            ...Object.entries(userScore).map(([user, score]) => [
                user,
                ...Object.values(score).map(
                    ({ sumOfCorrect, sumOfAll }) =>
                        `${((sumOfCorrect / sumOfAll) * 100).toFixed(2)}%`
                ),
            ]),
            // [
            //     "Average",
            //     ...Object.entries(averageSubjectScores).map(([name, score]) =>
            //         Object.values(score).map(  () => `${((score.sumOfCorrect / score.sumOfAll) * 100).toFixed(2)}%`)
            //     ),
            // ],
        ],
        {
            hasBorder: true,
            borderChars: "lightRounded",
            firstColumnTextAttr: { color: "blue" },
        }
    )
}

mainRender()