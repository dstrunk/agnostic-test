import * as vscode from "vscode";
import { getTestCommand, loadLastTest } from "./lib/helpers";

export const testType = ["focused", "file", "suite"] as const;
const runTest = (testStrategy: typeof testType[number]) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return vscode.window.showInformationMessage(
      "VSCodeTest: No File Selected."
    );
  }

  const document = editor?.document;

  if (!document) {
    return vscode.window.showInformationMessage(
      "VSCodeTest: No File Selected."
    );
  }

  const lineNumber = editor.selection.active.line;
  const command = getTestCommand(document, lineNumber, testStrategy);

  if (!command) {
    return vscode.window.showInformationMessage("VSCodeTest: No test found.");
  }

  run(command);
};

const runPrevious = () => {
  return loadLastTest() !== "" ? run(loadLastTest()) : false;
};

const run = (command: string) => {
  let terminal = getOrCreateTerminal();
  terminal.sendText(command);
};

const getOrCreateTerminal = () => {
  const count = (<any>vscode.window).terminals.length;
  if (count) {
    const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
    return terminals[count - 1];
  }

  return vscode.window.createTerminal("vscode-test");
};

export function activate(context: vscode.ExtensionContext) {
  let disposables = [];

  disposables.push(
    vscode.commands.registerCommand("vscode-test.runFocusedTest", () => {
      runTest("focused");
    })
  );

  disposables.push(
    vscode.commands.registerCommand("vscode-test.runTestFile", () => {
      runTest("file");
    })
  );

  disposables.push(
    vscode.commands.registerCommand("vscode-test.runTestSuite", () => {
      runTest("suite");
    })
  );

  disposables.push(
    vscode.commands.registerCommand("vscode-test.runPreviousTest", () => {
      runPrevious();
    })
  );

  disposables.forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
