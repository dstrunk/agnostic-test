import { readFileSync } from "fs";
import * as vscode from "vscode";
import * as findUp from "find-up";
import { Cypress } from "../runners/javascript/cypress";
import { Jest } from "../runners/javascript/jest";
import { PHPUnit } from "../runners/php/phpunit";
import { Pest } from "../runners/php/pest";
import { testType } from "../../extension";
import { ExUnit } from "../runners/elixir/exunit";

export const runners: Record<string, any> = {
  javascript: {
    cypress: Cypress,
    jest: Jest,
  },

  typescript: {
    cypress: Cypress,
    jest: Jest,
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
    case "typescript":
      return getJavaScriptTests(document);
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
    const data = readFileSync(composerJsonFile, "utf8");
    if (data.includes("pest")) {
        return "pest";
    }

    if (data.includes("phpunit")) {
      return "phpunit";
    }
  }

  return "";
};

export const getElixirTests = (document: vscode.TextDocument): string => {
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

  const runner = runners[languageId][framework];

  if (!runner) {
    return null;
  }

  return new runner(document, lineNumber, testStrategy);
};
