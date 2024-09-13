import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "../../runner";
import { testType } from "../../../extension";

export class Jest extends AbstractRunner {
    protected testRunnerType: string = 'jest';

    constructor(
    protected document: vscode.TextDocument,
    protected lineNumber: number,
    protected testStrategy: typeof testType[number],
    protected localConfig?: LocalConfig,
    ) {
        super(document, lineNumber, testStrategy, localConfig);
    }

    focusedTest() {
        return `${this.command} -- -i ${this.fileName} -t ${this.testName}`;
    }

    testFile() {
        return `${this.command} "${this.fileName}"`;
    }

    testSuite() {
        return `${this.command}`;
    }

    get command() {
        const command = this.localConfig?.javascript?.jest?.command
      ?? vscode.workspace.getConfiguration("agnostic-test").get("javascript.jest.command")
      ?? null;

        if (command) {
            return command;
        }

        return "node_modules/.bin/jest";
    }

    get testName(): string {
        for (let line = this.lineNumber; line >= 0; line--) {
            const { text } = this.document.lineAt(line);

            const regex = /^\s*(?:it)\(([^,)]+)/m;
            const match = text.match(regex);

            if (match) {
                return match[1].trim();
            }
        }

        return "";
    }
}
