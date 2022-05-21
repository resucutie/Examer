#!/usr/bin/env node

import path from "path"
import fs from "fs/promises"
import packageJson from "./package.json"
import { Command } from "commander"
import { terminal as term } from "terminal-kit"

export const cli = new Command(packageJson.name)
    .usage("<command> [options]")
    .description("CLI application for exam evaluation")
    .version(packageJson.version, "-v --vers", "Outputs the current version")
    .helpOption("-h --help", "Shows information about the program and commands")
    .configureHelp({
        sortSubcommands: true,
        // sortOptions: true,
    })
    .addHelpText(
        "after",
        '\nExample call:\n  $ examer table general "./exam.json" "./answers" -e table.xlsx'
    )
    .showSuggestionAfterError()

import "./commands/table"
import "./commands/test"

term.gray("\n****** ").brightGreen.bold(`Examer ${packageJson.version}`).gray(" ******")(
    "\n\n\n"
)

cli.parse()
