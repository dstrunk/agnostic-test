import * as vscode from "vscode";
import { testType } from "../extension";

export interface IRunner {
  run: Function;
  focusedTest: Function;
  testFile: Function;
  testSuite: Function;
}

export interface RunnerOptions {
  document: vscode.TextDocument;
  lineNumber: number;
  testStrategy: typeof testType[number];
}

export class AbstractRunner implements IRunner {
  document: vscode.TextDocument;
  lineNumber: number;
  testStrategy: string;

  constructor(
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
  ) {
    if (new.target === AbstractRunner) {
      throw new TypeError("Cannot construct AbstractRunner instance directly.");
    }

    this.document = document;
    this.lineNumber = lineNumber;
    this.testStrategy = testStrategy;
  }

  run() {
    switch (this.testStrategy) {
      case "focused":
        return this.focusedTest();
      case "file":
        return this.testFile();
      case "suite":
        return this.testSuite();
      default:
        return this.testSuite();
    }
  }

  focusedTest() {
    throw new TypeError("`focusedTest` should be implemented.");
  }

  testFile() {
    throw new Error("`testFile` should be implemented.");
  }

  testSuite() {
    throw new Error("`testSuite` should be implemented.");
  }
}
