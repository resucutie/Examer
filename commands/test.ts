import fs from "fs/promises"
import type { Stats } from "fs"
import { Argument } from "commander"
import { terminal as term } from "terminal-kit"

import { cli } from ".."
import { checkExam, checkQuestion } from "../handlers/exam"
import {
    terminal,
    getRelativePath,
    getExamContents,
    limitCharacters,
    isJsonValid,
} from "../utils"
import { rigidifyQuestion } from "../handlers/rigidifyStructures"
import { checkAnswers } from "../handlers/answers"
import { Answers } from "../types"
import path from "path"

cli.command("test")
    .description("Test the structure of an exam")
    .usage("<exam> <answers> [options]")
    .addArgument(new Argument("<exam>", "Exam file").argRequired())
    .addArgument(new Argument("<answers>", "Answer folder").argRequired())
    .addHelpText("after", "\nExample call:\n  $ examer test \"./exam.json\" \"./answers/\"")
    .action(async (examPath, answersPath, options) => {
        const examRelativePath = getRelativePath(examPath)
        const answersRelativePath = getRelativePath(answersPath)
        try {
            if (!(await fs.stat(answersRelativePath)).isDirectory()){
                error(new Error(`${answersRelativePath} is not a directory`))
            }
        } catch (err) {
            error(new Error(`${answersRelativePath} does not exist`))
        }


        terminal.createBadge("EXAM", "bgGray")("\n")
        let movedLines = 2

        terminal.createBadge("-", "bgGray")("Checking exam's structure")
        if (isJsonValid(await fs.readFile(examRelativePath, "utf8"))) {
            const examContents = await getExamContents(examRelativePath)

            await checkExam(examContents)
                .then(() => ok("bgBrightGreen"))
                .catch(error)
            movedLines++

            for (const index in examContents) {
                const question = rigidifyQuestion(examContents[index], {
                    identifier: (Number(index) + 1).toString(),
                })
                terminal.createBadge(
                    "-",
                    "bgGray"
                )(`Checking question ${question.identifier}`)
                if (question.statement)
                    term.gray(
                        ` (${limitCharacters(
                            question.statement,
                            Math.floor(term.width * 0.5)
                        )})`
                    )
                await checkQuestion(question, Number(index))
                    .then(() => ok("bgBrightGreen"))
                    .catch(error)
                movedLines++
            }
        } else {
            error(new Error("Invalid exam format. It is not a JSON file"))
        }

        let { x, y } = await terminal.promisedGetCursorLocation()
        term.moveTo(x, y - movedLines)
        terminal.createBadge("EXAM", "bgGreen").moveTo(x, y)
        term("\n")


        terminal.createBadge("ANSWERS", "bgGray")("\n")
        movedLines = 2

        const files = await fs.readdir(answersRelativePath)
        for (const file of files) {
            const filePath = path.join(answersRelativePath, file)
            terminal.createBadge(
                "-",
                "bgGray"
            )(`Checking ${file.substring(0, file.length - 5)}`)
            if (isJsonValid(await fs.readFile(filePath, "utf8"))) {
                const answers = JSON.parse(
                    await fs.readFile(filePath, "utf8")
                ) as Answers
                await checkAnswers(answers, filePath)
                    .then(() => ok("bgBrightBlue"))
                    .catch(error)
            } else {
                error(
                    new Error("Invalid answers format. It is not a JSON file")
                )
            }
            movedLines++
        }

        await terminal.promisedGetCursorLocation().then(({ x: newX, y: newY }) => {
            x = newX
            y = newY
        })
        term.moveTo(x, y - movedLines)
        terminal.createBadge("ANSWERS", "bgBlue").moveTo(x, y)
    })

const error = (err: Error) => {
    term("\n\n")
    terminal.createBadge("ERROR", "bgRed")(`${err.message}\n`)
    term.processExit(1)
    process.exit(1)
}

const ok = (color: string) => {
    terminal.moveCursorToStartOfLine()
    terminal.createBadge("✓", color)
    term("\n")
}
