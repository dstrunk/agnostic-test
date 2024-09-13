import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "../../runner";
import { testType } from "../../../extension";

export class Pest extends AbstractRunner {
    protected testRunnerType: string = 'pest';

    constructor(
        document: vscode.TextDocument,
        lineNumber: number,
        testStrategy: typeof testType[number],
        localConfig?: LocalConfig,
    ) {
        super(document, lineNumber, testStrategy, localConfig);
    }

    focusedTest() {
        return `${this.command} --filter ${this.testName}`;
    }

    testFile() {
        return `${this.command} --filter '${this.fileName}'`;
    }

    testSuite() {
        return `${this.command}`;
    }

    get command() {
        const command = this.localConfig?.php?.pest?.command
      ?? vscode.workspace.getConfiguration('agnostic-test').get('php.pest.command')
      ?? null;

        if (command) {
            return command;
        }

        return "vendor/bin/pest";
    }

    get fileName(): string {
        return super.fileName.replace(".php", "");
    }

    get testName(): string {
        for (let line = this.lineNumber; line >= 0; line--) {
            const { text } = this.document.lineAt(line);

            const regex = /^\s*(?:it|test|get)\(([^,)]+)/m;
            const match = text.match(regex);

            if (match) {
                const testname = match[1];
                return testname.trim();
            }
        }

        return "";
    }
}
