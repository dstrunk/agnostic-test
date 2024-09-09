module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "@lib/(.*)": "<rootDir>/src/lib/$1",
    "@runners/(.*)": "<rootDir>/src/lib/runners/$1",
    "^vscode$": "<rootDir>/__mocks__/vscode.ts"
  }
};
