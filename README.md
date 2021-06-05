# Agnostic Test

Run tests in VSCode across different languages with Zero Configuration®.

Agnostic Test is a spiritual brother to [test.vim][vim-test]. When I moved to VS Code, I missed my zero-configuration test runner that allowed for swapping languages while maintaining the same key mappings for running tests.

[VS Test][vs-test] is most similar to what I was looking for, but the project looked abandoned (and unpublished on the extensions directory), so Agnostic Test was born.

[vim-test]: https://github.com/vim-test/vim-test
[vs-test]: https://github.com/ignu/vs-test

## Commands

- `Run test under cursor` - If you're in a test file, run the test under the cursor
- `Run test file` - Run all tests within the file
- `Run test suite` - Run the full test suite
- `Run previous test` - Run the previous test. Handy for TDD, when editing a file outside of your test file.

## Keybindings

Similar to VS Test, if you are looking for the functionality of vim.test and are using the Vim extension, add the following to your `settings.json` (I will use `<leader>` as a designation for your leader key; replace `<leader>` with your actual leader key):

```json
// ...
"vim.normalModeKeyBindingsNonRecursive": [
    {
        "before": ["<leader>", "t"],
        "commands": ["agnostic-test.runFocusedTest"]
    },
    {
        "before": ["<leader>", "T"],
        "commands": ["agnostic-test.runCurrentTestFile"]
    },
    {
        "before": ["<leader>", "a"],
        "commands": ["agnostic-test.runTestSuite"]
    },
    {
        "before": ["<leader>", "g"],
        "commands": ["agnostic-test.runPreviousTest"]
    },
],
// ...
```

## Running in the commands manually

If you are using the extension and do not want to set up keybindings, you will need to run the commands manually. To do so:

- Press Ctrl + Shift + P
- Begin a search for "Agnostic Test"
- Select the desired command from the dropdown selection

## Currently Supported Testing Frameworks

At the moment, the following languages are supported:

### PHP

- PHPUnit

### JavaScript

- Cypress - If a test runner encounters the string `cy.` in the test file, it will run Cypress tests.
- Jest

## Requirements

This extension does not have any dependencies; however, the framework you are utilizing for testing likely will. Please refer to the documentation for your test framework for installation within your project.

## Known Issues

At the moment, this extension has no configuration. In true opinionated fashion, it expects the happy path for the supported testing frameworks. Future versions of Agnostic Test may support user-specified test type overrides, binary path configuration, etc. Until then, for any of the currently supported testing frameworks, it expects the following:

- Your VSCode workspace is the root of the project
- Your dependencies are installed via a package manager (not globally)
- Your file name, and secondly, your package manager's dependencies, are enough to determine the test being run

### Runner-specific Issues

#### Cypress

- It is difficult to tell if an entire suite should be run with the Cypress runner. This _could_ be done by testing that the file path of the suite is in the `/cypress` folder, but I'm personally not a fan of that convention, and I think it's going a bit **too** far in the "convention over configuration" route.

## Prior Art

- VS Test - https://github.com/ignu/vs-test
- test.vim - https://github.com/vim-test/vim-test
- Better PHPUnit - https://github.com/calebporzio/better-phpunit
