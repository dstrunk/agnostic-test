const vscode = {
    window: {
        showInformationMessage: jest.fn(),
        createTerminal: jest.fn(),
    },
    workspace: {
        getConfiguration: jest.fn(),
        getWorkspaceFolder: jest.fn(),
    },
    commands: {
        executeCommand: jest.fn(),
    },
    uri: {
        file: jest.fn((f) => ({ fsPath: f })),
    },
};

module.exports = vscode;
