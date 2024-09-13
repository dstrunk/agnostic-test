import * as vscode from "vscode";
import * as path from "path";
import { testType } from "@src/extension";

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

type TestRunnerConfig = {
    command?: string;
    docker?: {
        rootDirectory?: string;
    }
};

export interface LocalConfig {
    php?: {
        pest?: TestRunnerConfig;
        phpunit?: TestRunnerConfig;
    }

    javascript?: {
        jest?: TestRunnerConfig;
        vitest?: TestRunnerConfig;
        mocha?: TestRunnerConfig;
        cypress?: TestRunnerConfig;
    }

    elixir?: {
        exunit?: TestRunnerConfig;
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
        const terminal = this.getOrCreateTerminal();

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

    get fileName(): string {
        const fullPath = this.document.fileName;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(this.document.uri);
        const language = this.#languageFromDocument;
        const testRunner = this.#testRunnerFromClassName;

        let rootDirectory: string | null = null;
        if (this.localConfig && this.#isValidLanguage(language) && this.#isValidTestRunner(language, testRunner)) {
            rootDirectory = (this.localConfig as any)?.[language]?.[testRunner]?.docker?.rootDirectory
                ?? vscode.workspace.getConfiguration('agnostic-test').get(`${language}.${testRunner}.docker.rootDirectory`);
        }

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

    get #languageFromDocument(): string {
        const { languageId } = this.document;
        switch (languageId) {
        case 'typescriptreact':
        case 'typescript':
        case 'javascript':
            return 'javascript';

        case 'php':
            return 'php';

        case 'elixir':
            return 'elixir';

        default:
            throw new Error(`Unsupported language, or we weren't able to determine the language from this document type: ${languageId}`);
        }
    }

    get #testRunnerFromClassName(): string {
        const className = this.constructor.name.toLowerCase();
        switch (className) {
        case 'exunit':
            return 'exunit';

        case 'jest':
        case 'vitest':
        case 'mocha':
        case 'cypress':
            return `${className}`;

        case 'pest':
        case 'phpunit':
            return `${className}`;

        default:
            throw new Error(`Unsupported runner class: ${className}`);
        }
    }

    #isValidLanguage(lang: string): lang is keyof LocalConfig {
        return ['php', 'javascript', 'elixir'].includes(lang);
    }

    #isValidTestRunner(lang: keyof LocalConfig, runner: string): runner is keyof LocalConfig[typeof lang] {
        const runners: Record<keyof LocalConfig, string[]> = {
            php: ['pest', 'phpunit'],
            javascript: ['jest', 'vitest', 'mocha', 'cypress'],
            elixir: ['exunit']
        };

        return runners[lang].includes(runner);
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
