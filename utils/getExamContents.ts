import { Exam } from "../types"
import fs from "fs/promises"

export default async (path: string) => JSON.parse(await fs.readFile(path, "utf8")) as unknown as Exam