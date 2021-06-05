import * as vscode from "vscode";
import { testType } from "../extension";

export interface IRunner {
  run(): void;
  focusedTest(): string;
  testFile(): string;
  testSuite(): string;
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

  run(): void {
    let terminal = this.getOrCreateTerminal();

    switch (this.testStrategy) {
      case "focused":
        return terminal.sendText(this.focusedTest());

      case "file":
        return terminal.sendText(this.testFile());

      case "suite":
        return terminal.sendText(this.testSuite());

      default:
        return terminal.sendText(this.testSuite());
    }
  }

  focusedTest(): string {
    throw new TypeError("`focusedTest` should be implemented.");
  }

  testFile(): string {
    throw new Error("`testFile` should be implemented.");
  }

  testSuite(): string {
    throw new Error("`testSuite` should be implemented.");
  }

  getOrCreateTerminal() {
    const count = (<any>vscode.window).terminals.length;
    if (count) {
      const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
      return terminals[count - 1];
    }

    return vscode.window.createTerminal("vscode-test");
  }
}
