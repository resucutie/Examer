#!/usr/bin/env node

import path from "path"
import fs from "fs/promises"
import { Command, Argument } from "commander"
import { terminal as term, Terminal } from "terminal-kit"

import Exam, { checkExam, checkQuestion } from "./handlers/exam"
import { rigidifyQuestion } from "./handlers/rigidifyStructures"
import { Exam as ExamType } from "./types"
import { terminal, getExamContents } from "./utils"
import { getRelativePath, isJsonValid, limitCharacters } from "./utils"

export const cli = new Command()

import "./commands/table"
import "./commands/test"

cli
    .name("examer")
    .description("CLI application for exam evaluation")
    .version("0.0.1")

cli.parse()
