import * as vscode from 'vscode';
import { Jest } from './runners/javascript/jest';

jest.mock('vscode');

describe('AbstractRunner', () => {
    let mockDocument: vscode.TextDocument;
    let mockWorkspaceFolder: vscode.WorkspaceFolder;

    beforeEach(() => {
        mockDocument = {
            fileName: '/path/to/workspace/tests/example.test.js',
            uri: { fsPath: '/path/to/workspace/tests/example.test.js' } as vscode.Uri,
            languageId: 'javascript',
        } as vscode.TextDocument;

        mockWorkspaceFolder = {
            uri: { fsPath: '/path/to/workspace' } as vscode.Uri,
            name: 'TestWorkspace',
            index: 0,
        };

        (vscode.workspace.getWorkspaceFolder as jest.Mock).mockReturnValue(mockWorkspaceFolder);
    });

    describe('fileName getter', () => {
        it('should return relative path when no Docker config is present', () => {
            const runner = new Jest(mockDocument, 1, 'focused');
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should use Docker root directory when configured in local config', () => {
            const localConfig = {
                javascript: {
                    jest: {
                        docker: {
                            rootDirectory: '/app',
                        },
                    },
                },
            };

            const runner = new Jest(mockDocument, 1, 'focused', localConfig);
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should use Docker root directory when configured in VSCode settings', () => {
            (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
                get: jest.fn().mockReturnValue('/app'),
            });

            const runner = new Jest(mockDocument, 1, 'focused');
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should handle absolute Docker root directory', () => {
            const localConfig = {
                javascript: {
                    jest: {
                        docker: {
                            rootDirectory: '/absolute/docker/path',
                        },
                    },
                },
            };

            const absoluteDockerMockDocument = {
                fileName: '/absolute/docker/path/tests/example.test.js',
                uri: { fsPath: '/absolute/docker/path/tests/example.test.js' } as vscode.Uri,
                languageId: 'javascript',
            } as vscode.TextDocument;

            const runner = new Jest(absoluteDockerMockDocument, 1, 'focused', localConfig);
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should handle relative Docker root directory', () => {
            const localConfig = {
                javascript: {
                    jest: {
                        docker: {
                            rootDirectory: 'relative/docker/path',
                        },
                    },
                },
            };

            const relativeDockerMockDocument = {
                fileName: '/path/to/workspace/relative/docker/path/tests/example.test.js',
                uri: { fsPath: '/path/to/workspace/relative/docker/path/tests/example.test.js' } as vscode.Uri,
                languageId: 'javascript',
            } as vscode.TextDocument;

            const runner = new Jest(relativeDockerMockDocument, 1, 'focused', localConfig);
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should fall back to workspace relative path if Docker path doesn\'t match', () => {
            const localConfig = {
                javascript: {
                    jest: {
                        docker: {
                            rootDirectory: '/different/docker/path',
                        },
                    },
                },
            };

            const runner = new Jest(mockDocument, 1, 'focused', localConfig);
            expect(runner.fileName).toBe('tests/example.test.js');
        });

        it('should return full path if no workspace folder is found', () => {
            (vscode.workspace.getWorkspaceFolder as jest.Mock).mockReturnValue(undefined);

            const runner = new Jest(mockDocument, 1, 'focused');
            expect(runner.fileName).toBe('/path/to/workspace/tests/example.test.js');
        });
    });
});
