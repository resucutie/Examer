import path from "path"
import fs from "fs/promises"
import { Answers, AnswerType } from "../types"

export async function getUserAnswers(folderPath: string) {
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
        const contents = await fs.readFile(filePath, "utf8")
        const answers = JSON.parse(contents) as Answers
        users[file.substring(0, file.length - 5)] = new UserAnswer(answers)
    }
    
    return users
}

export class UserAnswer {
    private answers: Answers

    constructor(answers: Answers) {
        this.answers = answers
    }

    getAllAnswers() {
        return this.answers
    }

    getAnswer(index: number) {
        return this.answers[index]
    }
}