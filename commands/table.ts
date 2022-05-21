import path from "path"
import { Argument } from "commander"
import { terminal as term } from "terminal-kit"

import { cli } from ".."
import Exam from "../handlers/exam"
import { getMultipleAnswers } from "../handlers/answers"
import { table as tableUtil, getRelativePath, getExamContents } from "../utils"

const table = cli
    .command("table")
    .description("Generates tables")

table
    .command("general")
    .description("Get the general scores of the answers")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answers>", "Answers folder").argRequired())
    .action(async (examPath, answersPath, options) => {
        const answers = await getMultipleAnswers(getRelativePath(answersPath))
        const exam = new Exam(await getExamContents(getRelativePath(examPath)))

        //@ts-ignore
        term.table(tableUtil.generalScores(answers, exam), {
            hasBorder: true,
            borderChars: "lightRounded",
            firstColumnTextAttr: { color: "blue" },
            width: term.width * 0.8,
        })
    })

table
    .command("individual")
    .description("Get the individual score of the answer")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answer>", "Answer file").argRequired())
    .action(async (examPath, answerPath, options) => {
        const relativeAnswerPath = getRelativePath(answerPath)
        const answers = await getMultipleAnswers(
            path.dirname(relativeAnswerPath)
        )
        const exam = new Exam(await getExamContents(getRelativePath(examPath)))
        //@ts-ignore
        term.table(
            tableUtil.individualAnswers(
                answers[
                    path
                        .parse(relativeAnswerPath)
                        .base.slice(
                            0,
                            path.parse(relativeAnswerPath).base.length -
                                path.extname(relativeAnswerPath).length
                        )
                ],
                exam
            ),
            {
                hasBorder: true,
                borderChars: "lightRounded",
                firstColumnTextAttr: { color: "blue" },
                width: term.width * 0.8,
            }
        )
    })
