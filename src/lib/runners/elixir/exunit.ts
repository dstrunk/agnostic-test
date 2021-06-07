import * as vscode from "vscode";
import { AbstractRunner } from "../../runner";
import { testType } from "../../../extension";

export class ExUnit extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
  ) {
    super(document, lineNumber, testStrategy);
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
    // @TODO add config settings for this.
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
