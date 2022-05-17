#!/usr/bin/env node

import path from "path"
import fs from "fs/promises"
import { Command, Argument } from "commander"

import Exam from "./handlers/exam"
import { Questionnaire } from "./types"
import { getUserAnswers } from "./handlers/answers"
import { generalScores, individualAnswers } from "./utils/table"
import { terminal as term } from "terminal-kit"

const program = new Command()

const getExamContents = async (path: string) =>
    JSON.parse(await fs.readFile(path, "utf8")) as unknown as Questionnaire

program
    .name("examer")
    .description("CLI application for exam evaluation")
    .version("0.0.1")

program
    .command("general")
    .description("Get the general scores of the answers")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answers>", "Answers folder").argRequired())
    .action(async (examPath, answersPath, options) => {
        const answers = await getUserAnswers(answersPath)
        const exam = new Exam(await getExamContents(examPath))

        //@ts-ignore
        term.table(generalScores(answers, exam), {
            hasBorder: true,
            borderChars: "lightRounded",
            firstColumnTextAttr: { color: "blue" },
            width: term.width * 0.8,
        })
    })

program
    .command("individual")
    .description("Get the individual score of the answer")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answer>", "Answer file").argRequired())
    .action(async (examPath, answerPath, options) => {
        const answers = await getUserAnswers(path.dirname(answerPath))
        const exam = new Exam(await getExamContents(examPath))
        //@ts-ignore
        term.table(
            individualAnswers(
                answers[
                    path
                        .parse(answerPath)
                        .base.slice(
                            0,
                            path.parse(answerPath).base.length -
                                path.extname(answerPath).length
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

program.parse()
