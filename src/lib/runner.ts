import { readFileSync } from "fs";
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
  localConfig?: vscode.TextDocument;
}

export interface LocalConfig {
    php?: {
        pest?: {
            command?: string;
        }
        phpunit?: {
            command?: string;
        }
    }

    javascript?: {
        jest?: {
            command?: string;
        }
        mocha?: {
            command?: string;
        }
        cypress?: {
            command?: string;
        }
    }

    elixir?: {
        exunit?: {
            command?: string;
            docker?: {
                rootDirectory?: string;
            }
        }
    }
}

export class AbstractRunner implements IRunner {
  constructor(
    protected document: vscode.TextDocument,
    protected lineNumber: number,
    protected testStrategy: typeof testType[number],
    protected localConfig?: LocalConfig,
  ) {
    if (new.target === AbstractRunner) {
      throw new TypeError("Cannot construct AbstractRunner instance directly.");
    }
  }

  run(): void {
    let terminal = this.getOrCreateTerminal();

    switch (this.testStrategy) {
      case "focused":
        vscode.commands.executeCommand('workbench.action.terminal.clear');
        terminal.show();
        return terminal.sendText(this.focusedTest());

      case "file":
        vscode.commands.executeCommand('workbench.action.terminal.clear');
        terminal.show();
        return terminal.sendText(this.testFile());

      case "suite":
        vscode.commands.executeCommand('workbench.action.terminal.clear');
        terminal.show();
        return terminal.sendText(this.testSuite());

      default:
        vscode.commands.executeCommand('workbench.action.terminal.clear');
        terminal.show();
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

    return vscode.window.createTerminal("agnostic-test");
  }
}
