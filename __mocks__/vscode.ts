const vscode = {
    window: {
        showInformationMessage: jest.fn(),
        createTerminal: jest.fn(),
    },
    workspace: {
        getConfiguration: jest.fn(),
    },
    commands: {
        executeCommand: jest.fn(),
    },
    // Add any other VS Code API elements that you use in your code
};

module.exports = vscode;
