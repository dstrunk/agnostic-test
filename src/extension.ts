import * as vscode from "vscode";
import { getTestRunner } from "./lib/helpers";

export const testType = ["focused", "file", "suite", "last"] as const;
const runTest = (
  testStrategy: typeof testType[number],
  context: vscode.ExtensionContext
) => {
  if (
    testStrategy === "last" &&
    context.workspaceState.get("agnostic-test.lastRunner")
  ) {
    const lastRunner: any = context.workspaceState.get(
      "agnostic-test.lastRunner"
    );
    return lastRunner.run();
  }

  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return vscode.window.showInformationMessage(
      "Agnostic Test: No File Selected."
    );
  }

  const document = editor?.document;

  if (!document) {
    return vscode.window.showInformationMessage(
      "Agnostic Test: No File Selected."
    );
  }

  const lineNumber = editor.selection.active.line;
  const runner = getTestRunner(document, lineNumber, testStrategy);

  if (!runner) {
    return vscode.window.showInformationMessage(
      "Agnostic Test: No test found."
    );
  }

  context.workspaceState.update("agnostic-test.lastRunner", runner);
  setGlobalRunner(runner);

  return runner.run();
};

export function activate(context: vscode.ExtensionContext) {
  let disposables = [];

  disposables.push(
    vscode.commands.registerCommand("agnostic-test.runFocusedTest", () => {
      runTest("focused", context);
    })
  );

  disposables.push(
    vscode.commands.registerCommand("agnostic-test.runTestFile", () => {
      runTest("file", context);
    })
  );

  disposables.push(
    vscode.commands.registerCommand("agnostic-test.runTestSuite", () => {
      runTest("suite", context);
    })
  );

  disposables.push(
    vscode.commands.registerCommand("agnostic-test.runPreviousTest", () => {
      runTest("last", context);
    })
  );

  disposables.forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}

var globalRunner: any;
export function setGlobalRunner(runner: any) {
  globalRunner = runner;
}

export function getGlobalRunner(): any {
  return globalRunner;
}
