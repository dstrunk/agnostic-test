import * as vscode from "vscode";
import { AbstractRunner } from "../../runner";
import { testType } from "../../../extension";

export class Pest extends AbstractRunner {
  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
  ) {
    super(document, lineNumber, testStrategy);
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
    // @TODO add config settings for this.
    return "vendor/bin/pest";
  }

  get fileName(): string {
    const match = this.document.fileName.match(/\w+(?:\.\w+).*$/m);
    if (!match) {
      return "";
    }

    return match[0].replace(".php", "");
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
