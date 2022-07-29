import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "../../runner";
import { testType } from "../../../extension";

export class Cypress extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number],
    localConfig?: LocalConfig,
  ) {
    super(document, lineNumber, testStrategy, localConfig);
  }

  focusedTest() {
    return `${this.command} run -- --record --spec "${this.testName}"`;
  }

  testFile() {
    return `${this.command} run -- --record --spec "${this.fileName}"`;
  }

  testSuite() {
    return `${this.command} run -- --record`;
  }

  get command() {
    let command;
    if (this.localConfig) {
      command = this.localConfig?.javascript?.cypress?.command;

      if (command) {
        return command;
      }
    }

    command = vscode.workspace.getConfiguration('agnostic-test').get('javascript.cypress.command');
    if (command) {
        return command;
    }

    return "node_modules/.bin/cypress";
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

      const regex = /\bit ?\(["'](.+)["']/;
      const match = text.match(regex);

      if (match) {
        return match[1].trim();
      }
    }

    return "";
  }
}
