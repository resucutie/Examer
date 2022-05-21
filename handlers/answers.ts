import path from "path"
import fs from "fs/promises"
import { Answers, AnswerTypes, UserAnswer as UserAnswerType } from "../types"
import { isJsonValid } from "../utils"
import { rigidifyUserAnswer } from "./rigidifyStructures"

export async function getMultipleAnswers(folderPath: string) {
    let stats
    try {
        stats = await fs.stat(folderPath)
    } catch (err) {
        throw new Error("No such directory")
    }
    if (!(await stats.isDirectory())) throw new Error("Not a directory")

    const files = await fs.readdir(folderPath)

    let users: { [user: string]: UserAnswer } = {}
    for (const file of files) {
        const filePath = path.join(folderPath, file)
        users[file.substring(0, file.length - 5)] = await getSingleAnswer(filePath)
    }
    
    return users
}

export async function getSingleAnswer(filePath: string) {
    let stats
    try {
        stats = await fs.stat(filePath)
    } catch (err) {
        throw new Error("No such file")
    }
    if (!(await stats.isFile())) throw new Error("Not a file")

    const contents = await fs.readFile(filePath, "utf8")
    
    if(!isJsonValid(contents)) throw new Error("Invalid JSON")
    const answers = JSON.parse(contents) as Answers

    checkAnswers(answers, filePath)

    return new UserAnswer(answers)
}

export class UserAnswer {
    private answers: Answer[]

    constructor(answers: Answers) {
        this.answers = answers.map((answer) => new Answer(answer))
    }

    getAllAnswers() {
        return this.answers
    }

    getAnswer(index: number) {
        return this.answers[index]
    }
}

export class Answer {
    private answer: UserAnswerType

    constructor(answer: UserAnswerType | AnswerTypes | AnswerTypes[]) {
        this.answer = rigidifyUserAnswer(answer)
    }

    get value() {
        return this.answer.value
    }

    get override() {
        return this.answer.override
    }
}

export function checkAnswers(answers: Answers, name: string) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(answers))
            return reject(new Error(`Answer of ${name} must be an array`))
        if (answers.length === 0)
            return reject(new Error(`Answer of ${name} does not contain any answer`))

        resolve(true)
    })
}