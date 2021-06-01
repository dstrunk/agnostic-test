import * as vscode from "vscode";
import { Cypress } from "../runners/javascript/cypress";
import { Jest } from "../runners/javascript/jest";
import { PHPUnit } from "../runners/php/phpunit";
import { testType } from "../../extension";

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
  },
};

let lastTest: string = "";
export const saveLastTest = (testName: string): string => (lastTest = testName);
export const loadLastTest = (): string => lastTest;
export const remember = (callback: any) => {
  const command = callback();
  if (command) {
    return saveLastTest(command);
  } else {
    return loadLastTest();
  }
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
    default:
      vscode.window.showInformationMessage(
        `${languageId} is not currently supported.`
      );
      return false;
  }
};

export const getJavaScriptTests = (_document: vscode.TextDocument) => {
  // @TODO read package.json and determine which tests should be run; regex test for "mocha" or "jest"
  // @TODO read the document being run to check for the string "cy."; if so, return "cypress"
  return "jest";
};
export const getPHPTests = (_document: vscode.TextDocument) => {
  // @TODO read composer.json to determine framework to return
  return "phpunit";
};

export const getTestCommand = (
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

  const instance = new runner(document, lineNumber, testStrategy);

  return remember(() => instance.run());
};
