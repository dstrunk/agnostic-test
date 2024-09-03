import * as vscode from "vscode";
import * as path from "path";
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
    const command = this.localConfig?.elixir?.exunit?.command
      ?? vscode.workspace.getConfiguration('agnostic-test').get('elixir.exunit.command')
      ?? null;

    if (command) {
      return command;
    }

    return "mix test";
  }

  get fileName(): string {
    const fullPath = this.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(this.document.uri);
    let rootDirectory = this.localConfig?.elixir?.exunit?.docker?.rootDirectory
      ?? vscode.workspace.getConfiguration('agnostic-test').get('elixir.exunit.docker.rootDirectory')
      ?? null;

    if (rootDirectory && workspaceFolder) {
      // If a root directory is provided (Docker is enabled)
      const normalizedFullPath = path.normalize(fullPath);

      // Handle relative paths by resolving them against the workspace folder
      if (!path.isAbsolute(rootDirectory)) {
       rootDirectory = path.resolve(workspaceFolder.uri.fsPath, rootDirectory);
      }

      const normalizedRootDirectory = path.normalize(rootDirectory);
      if (normalizedFullPath.startsWith(normalizedRootDirectory)) {
        return normalizedFullPath.slice(normalizedRootDirectory.length).replace(/^[/\\]+/, '');
      } else {
        // If the full path doesn't start with the root directory,
        // fall back to using the workspace folder as the base
        return path.relative(workspaceFolder.uri.fsPath, normalizedFullPath);
      }
    }

    if (workspaceFolder) {
      return path.relative(workspaceFolder.uri.fsPath, fullPath);
    }

    return fullPath;
  }
}
