import * as vscode from "vscode";
import { AbstractRunner } from "../../runner";
import { testType } from "../../../extension";

export class Jest extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
  ) {
    super(document, lineNumber, testStrategy);
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
    let command = vscode.workspace.getConfiguration('agnostic-test').get('javascript.jest.command');
    if (command) {
        return command;
    }

    return "node_modules/.bin/jest";
  }

  get fileName(): string {
    const match = this.document.fileName.match(/\w+(?:\.\w+).*$/);
    if (!match) {
      return "";
    }

    return match[0];
  }

  get testName(): string {
    for (let line = this.lineNumber; line >= 0; line--) {
      const { text } = this.document.lineAt(line);

      const regex = /^\s*(?:it|test|get)\(([^,)]+)/m;
      const match = text.match(regex);

      if (match) {
        return match[1].trim();
      }
    }

    return "";
  }
}
