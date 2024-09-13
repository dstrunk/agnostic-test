import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "@lib/runner";
import { testType } from "@src/extension";

export class ExUnit extends AbstractRunner {
    protected testRunnerType: string = 'exunit';

    constructor(
        document: vscode.TextDocument,
        lineNumber: number,
        testStrategy: typeof testType[number],
        localConfig?: LocalConfig,
    ) {
        super(document, lineNumber, testStrategy, localConfig);
    }

    focusedTest() {
        return `${this.command} ${this.fileName}:${this.lineNumber}`;
    }

    testFile() {
        return `${this.command} ${this.fileName}`;
    }

    testSuite() {
        return `${this.command}`;
    }

    get command() {
        const command = this.localConfig?.elixir?.exunit?.command
            ?? vscode.workspace.getConfiguration('agnostic-test').get('elixir.exunit.command')
            ?? null;

        if (command) {
            return command;
        }

        return "mix test";
    }
}
