import * as vscode from 'vscode';
import * as fs from 'fs';
import * as findUp from 'find-up';
import { getTestType, getJavaScriptTests, getPHPTests, getElixirTests, getTestRunner } from './index';
import { Cypress } from '../runners/javascript/cypress';
import { Jest } from '../runners/javascript/jest';
import { Mocha } from '../runners/javascript/mocha';
import { Vitest } from '../runners/javascript/vitest';
import { PHPUnit } from '../runners/php/phpunit';
import { Pest } from '../runners/php/pest';
import { ExUnit } from '../runners/elixir/exunit';

jest.mock('vscode');
jest.mock('fs');
jest.mock('find-up');

const mockFindUpSync = jest.fn();
(findUp.sync as unknown) = mockFindUpSync;

describe('index module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTestType', () => {
        it('should return the correct test type for JavaScript', () => {
            const mockDocument = {
                languageId: 'javascript',
                fileName: 'test.js'
            } as vscode.TextDocument;

            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'jest': '^26.0.0' } }));

            expect(getTestType(mockDocument)).toBe('jest');
        });

        it('should return the correct test type for PHP', () => {
            const mockDocument = {
                languageId: 'php',
                fileName: 'test.php'
            } as vscode.TextDocument;

            mockFindUpSync.mockReturnValue('/path/to/composer.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 'require-dev': { 'phpunit/phpunit': '^9.0' } }));

            expect(getTestType(mockDocument)).toBe('phpunit');
        });

        it('should return the correct test type for Elixir', () => {
            const mockDocument = {
                languageId: 'elixir',
                fileName: 'test.exs'
            } as vscode.TextDocument;

            expect(getTestType(mockDocument)).toBe('exunit');
        });
    });

    describe('getJavaScriptTests', () => {
        it('should return "cypress" if the file contains "cy."', () => {
            const mockDocument = { fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('cy.visit("/")');

            expect(getJavaScriptTests(mockDocument)).toBe('cypress');
        });

        it('should return "jest" if package.json contains jest', () => {
            const mockDocument = { fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'jest': '^26.0.0' } }));

            expect(getJavaScriptTests(mockDocument)).toBe('jest');
        });

        it('should return "vitest" if package.json contains vitest', () => {
            const mockDocument = { fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'vitest': '^2.0' } }));

            expect(getJavaScriptTests(mockDocument)).toBe('vitest');
        });

        it('should return "mocha" if package.json contains mocha', () => {
            const mockDocument = { fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'mocha': '^26.0' } }));

            expect(getJavaScriptTests(mockDocument)).toBe('mocha');
        });
    });

    describe('getPHPTests', () => {
        it('should return "phpunit" if composer.json contains phpunit/phpunit', () => {
            const mockDocument = { fileName: 'test.php' } as vscode.TextDocument;
            mockFindUpSync.mockReturnValue('/path/to/composer.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 'require-dev': { 'phpunit/phpunit': '9.6' } }));

            expect(getPHPTests(mockDocument)).toBe('phpunit');
        });

        it('should return "pest" if composer.json contains pestphp/pest', () => {
            const mockDocument = { fileName: 'test.php' } as vscode.TextDocument;
            mockFindUpSync.mockReturnValue('/path/to/composer.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 'require-dev': { 'pestphp/pest': '^1.0' } }));

            expect(getPHPTests(mockDocument)).toBe('pest');
        });
    });

    describe('getTestRunner', () => {
        it('should return the correct runner instance for JavaScript (Jest)', () => {
            const mockDocument = { languageId: 'javascript', fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'jest': '^26.0.0' } }));

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(Jest);
        });

        it('should return the correct runner instance for JavaScript (Vitest)', () => {
            const mockDocument = { languageId: 'javascript', fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'vitest': '^2.0' } }));

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(Vitest);
        });

        it('should return the correct runner instance for JavaScript (Mocha)', () => {
            const mockDocument = { languageId: 'javascript', fileName: 'test.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockReturnValue('// Test file content');
            mockFindUpSync.mockReturnValue('/path/to/package.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ dependencies: { 'mocha': '^10.7.0' } }));

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(Mocha);
        });

        it('should return the correct runner instance for JavaScript (Cypress)', () => {
            const mockDocument = { languageId: 'javascript', fileName: 'test.cy.js' } as vscode.TextDocument;
            (fs.readFileSync as jest.Mock).mockImplementationOnce(() => 'cy.visit("/")');

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(Cypress);
        });

        it('should return the correct runner instance for PHP (PHPUnit)', () => {
            const mockDocument = { languageId: 'php', fileName: 'test.php' } as vscode.TextDocument;
            mockFindUpSync.mockReturnValue('/path/to/composer.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 'require-dev': { 'phpunit/phpunit': '^9.0' } }));

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(PHPUnit);
        });

        it('should return the correct runner instance for PHP (Pest)', () => {
            const mockDocument = { languageId: 'php', fileName: 'test.php' } as vscode.TextDocument;
            mockFindUpSync.mockReturnValue('/path/to/composer.json');
            (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ 'require-dev': { 'pestphp/pest': '^1.0' } }));

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(Pest);
        });

        it('should return the correct runner instance for Elixir (ExUnit)', () => {
            const mockDocument = { languageId: 'elixir', fileName: 'test.exs' } as vscode.TextDocument;

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeInstanceOf(ExUnit);
        });

        it('should return null for unsupported languages', () => {
            const mockDocument = { languageId: 'unsupported', fileName: 'test.unsupported' } as vscode.TextDocument;

            const runner = getTestRunner(mockDocument, 1, 'focused');
            expect(runner).toBeNull();
        });
    });
});
