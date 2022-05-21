import fs from "fs/promises"
import path from "path"
import { Argument, Option } from "commander"
import { terminal as term } from "terminal-kit"

import { cli } from ".."
import Exam from "../handlers/exam"
import { getMultipleAnswers, getSingleAnswer } from "../handlers/answers"
import { table as tableUtil, getRelativePath, getExamContents } from "../utils"

const table = cli.command("table").description("Generates tables")

table
    .command("general")
    .description("Get the general scores of the answers")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answers>", "Answers folder").argRequired())
    .addOption(new Option("-e --export <path>", "Export the table to a spreadsheet. It will format to an Excel table (xlsx) if the path's extension ends with .xlsx, otherwise it will format to an CSV table"))
    .action(async (examPath, answersPath, options) => {
        const answers = await getMultipleAnswers(getRelativePath(answersPath))
        const exam = new Exam(await getExamContents(getRelativePath(examPath)))

        const table = tableUtil.generalScores(answers, exam)

        if (options.export && typeof options.export === "string") {
            const exportPath = path.resolve(getRelativePath(options.export))
            tableUtil.toExcelJS(table).xlsx.writeFile(exportPath)
        }

        //@ts-ignore
        term.table(table, {
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
    .addOption(new Option("-e --export <path>", "Export the table to a spreadsheet. It will format to an Excel table (xlsx) if the path's extension ends with .xlsx, otherwise it will format to an CSV table"))
    .action(async (examPath, answerPath, options) => {
        const relativeAnswerPath = getRelativePath(answerPath)
        const answer = await getSingleAnswer(relativeAnswerPath)
        const exam = new Exam(await getExamContents(getRelativePath(examPath)))

        const table = tableUtil.individualAnswers(answer, exam)

        if (options.export && typeof options.export === "string") {
            const exportPath = path.resolve(getRelativePath(options.export))
            switch(path.extname(exportPath)) {
                case ".xlsx":
                    tableUtil.toExcelJS(table).xlsx.writeFile(exportPath)
                    break
                case ".csv":
                    tableUtil.toExcelJS(table).csv.writeFile(exportPath)
                    break
                default:
                    tableUtil.toExcelJS(table).csv.writeFile(exportPath)
                    break
            }
        }
        //@ts-ignore
        term.table(table, {
            hasBorder: true,
            borderChars: "lightRounded",
            firstColumnTextAttr: { color: "blue" },
            width: term.width * 0.8,
        })
    })
