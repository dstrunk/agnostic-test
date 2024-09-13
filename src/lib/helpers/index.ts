import { readFileSync } from "fs";
import * as vscode from "vscode";
import * as findUp from "find-up";
import { Cypress } from "@runners/javascript/cypress";
import { Jest } from "@runners/javascript/jest";
import { Mocha } from "@runners/javascript/mocha";
import { PHPUnit } from "@runners/php/phpunit";
import { Pest } from "@runners/php/pest";
import { testType } from "@src/extension";
import { ExUnit } from "@runners/elixir/exunit";
import { Vitest } from "@runners/javascript/vitest";
import { AbstractRunner } from "../runner";

export const runners: Record<string, any> = {
    javascript: {
        cypress: Cypress,
        jest: Jest,
        vitest: Vitest,
        mocha: Mocha,
    },

    typescript: {
        cypress: Cypress,
        jest: Jest,
        vitest: Vitest,
        mocha: Mocha,
    },

    typescriptreact: {
        cypress: Cypress,
        jest: Jest,
        vitest: Vitest,
        mocha: Mocha,
    },

    php: {
        phpunit: PHPUnit,
        pest: Pest,
    },

    elixir: {
        exunit: ExUnit,
    },
};

export const getTestType = (document: vscode.TextDocument): string | false => {
    const { languageId } = document;

    switch (languageId) {
    case "typescriptreact":
    case "typescript":
    case "javascript":
        return getJavaScriptTests(document);

    case "php":
        return getPHPTests(document);

    case "elixir":
        return getElixirTests(document);

    default:
        vscode.window.showInformationMessage(
            `${languageId} is not currently supported.`
        );
        return false;
    }
};

export const getJavaScriptTests = (document: vscode.TextDocument): string => {
    const data = readFileSync(document.fileName, "utf8");
    if (data.includes("cy.")) {
        return "cypress";
    }

    const packageJsonFile = findUp.sync("package.json", {
        cwd: document.fileName,
    });

    if (packageJsonFile) {
        const packageData = readFileSync(packageJsonFile, "utf8");
        if (packageData.includes("mocha")) {
            return "mocha";
        }

        if (packageData.includes("vitest")) {
            return "vitest";
        }

        if (packageData.includes("jest")) {
            return "jest";
        }
    }

    return "";
};

export const getPHPTests = (document: vscode.TextDocument): string => {
    const composerJsonFile = findUp.sync("composer.json", {
        cwd: document.fileName,
    });

    if (composerJsonFile) {
        const data = JSON.parse(readFileSync(composerJsonFile, "utf8"));

        if (Object.keys(data['require-dev']).some((entry: string) => entry.includes('pest'))) {
            return "pest";
        }

        if (Object.keys(data['require-dev']).some((entry: string) => entry.includes('phpunit'))) {
            return "phpunit";
        }
    }

    return "";
};

export const getElixirTests = (_document: vscode.TextDocument): string => {
    return "exunit";
};

/**
 * Factory method to return one of the supported test runners in this extension.
 * @param document The current document
 * @param lineNumber the current cursor position
 * @param testStrategy focused, file, suite or last
 * @returns one of the supported runners
 */
export const getTestRunner = (
    document: vscode.TextDocument,
    lineNumber: number,
    testStrategy: typeof testType[number]
) => {
    const { languageId } = document;
    const framework = getTestType(document);

    if (!framework) {
        return null;
    }

    const runner: typeof AbstractRunner | undefined = runners[languageId][framework];

    if (!runner) {
        return null;
    }

    const localConfig = findUp.sync(".testrc.json", {
        cwd: document.fileName,
    });

    if (localConfig) {
        const data = JSON.parse(readFileSync(localConfig, "utf8"));
        return new runner(document, lineNumber, testStrategy, data);
    } else {
        return new runner(document, lineNumber, testStrategy);
    }
};
