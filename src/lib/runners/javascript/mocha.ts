import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "../../runner";
import { testType } from "../../../extension";

export class Mocha extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number],
    localConfig?: LocalConfig,
  ) {
    super(document, lineNumber, testStrategy, localConfig);
  }

  focusedTest() {
    return `${this.command} -g ${this.testName}`;
  }

  testFile() {
    return `${this.command} ${this.fileName}`;
  }

  testSuite() {
    return `${this.command}`;
  }

  get command() {
    const command = this.localConfig?.javascript?.mocha?.command
      ?? vscode.workspace.getConfiguration('agnostic-test').get('javascript.mocha.command')
      ?? null;

    if (command) {
        return command;
    }

    return "node_modules/.bin/mocha";
  }

  get fileName(): string {
    const match = this.document.uri.fsPath;
    if (!match) {
      return "";
    }

    return match;
  }

  get testName(): string {
    for (let line = this.lineNumber; line >= 0; line--) {
      const { text } = this.document.lineAt(line);

      const regex = /^\s*(?:it|test)\(([^,)]+)/m;
      const match = text.match(regex);

      if (match) {
        return match[1].trim();
      }
    }

    return "";
  }
}
