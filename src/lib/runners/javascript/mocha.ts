import * as vscode from "vscode";
import { AbstractRunner } from "../../runner";
import { testType } from "../../../extension";

export class Mocha extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
  ) {
    super(document, lineNumber, testStrategy);
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
    let command = vscode.workspace.getConfiguration('agnostic-test').get('javascript.mocha.command');
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
