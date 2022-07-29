import * as vscode from "vscode";
import { AbstractRunner, LocalConfig } from "../../runner";
import { testType } from "../../../extension";

export class ExUnit extends AbstractRunner {
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
    let command;
    if (this.localConfig) {
      command = this.localConfig?.elixir?.exunit?.command;

      if (command) {
        return command;
      }
    }

    command = vscode.workspace.getConfiguration('agnostic-test').get('elixir.exunit.command');
    if (command) {
        return command;
    }

    return "mix test";
  }

  get fileName(): string {
    return this.document.fileName;
  }

  get testName(): string {
    for (let line = this.lineNumber; line >= 0; line--) {
      const { text } = this.document.lineAt(line);

      const regex =
        /^\s*(?:public|private|protected)?\s*function\s*(\w+)\s*\(.*$/;
      const match = text.match(regex);

      if (match) {
        const testname = match[1];
        return testname.trim();
      }
    }

    return "";
  }
}
