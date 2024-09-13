# Agnostic Test

Run tests in VSCode across different languages with Zero Configuration®.

Agnostic Test is a spiritual sibling to [test.vim][vim-test]. When I moved to VS Code, I missed my zero-configuration test runner that allowed for swapping languages while maintaining the same key mappings for running tests.

[VS Test][vs-test] is most similar to what I was looking for, but the project looked abandoned (and unpublished on the extensions directory), so Agnostic Test was born.

[vim-test]: https://github.com/vim-test/vim-test
[vs-test]: https://github.com/ignu/vs-test

## Commands

- `Run test under cursor` - If you're in a test file, run the test under the cursor
- `Run test file` - Run all tests within the file
- `Run test suite` - Run the full test suite
- `Run previous test` - Run the previous test. Handy for TDD when editing a file outside of your test file.

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

## Global configuration

You can customize the commands run for specific test runners. This is handy if, for instance, you would like to run a global test runner instead of a project-specific instance installed via a package manager.

Here are the currently available configuration options (settings should be added to your editor's `settings.json` file):

```json
{
    "agnostic-test.php.pest.command": null,
    "agnostic-test.php.pest.docker.rootDirectory": null,
    "agnostic-test.php.phpunit.command": null,
    "agnostic-test.php.phpunit.docker.rootDirectory": null,
    "agnostic-test.javascript.jest.command": null,
    "agnostic-test.javascript.jest.docker.rootDirectory": null,
    "agnostic-test.javascript.mocha.command": null,
    "agnostic-test.javascript.mocha.docker.rootDirectory": null,
    "agnostic-test.javascript.cypress.command": null,
    "agnostic-test.javascript.cypress.docker.rootDirectory": null,
    "agnostic-test.elixir.exunit.command": null,
    "agnostic-test.elixir.exunit.docker.rootDirectory": null
}
```

### Project-specific configuration

For some projects, you may wish to have a different configuration that does not interfere with your global configuration. For example, projects using Docker may need additional configuration to get your test runner working within a Docker container.

In cases such as these, a project-specific configuration can be used to overload global configuration defaults.

Create a `.testrc.json` file in the root of your directory with the following contents:

```json
{
    "php": {
        "pest": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        },
        "phpunit": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        }
    },

    "javascript": {
        "jest": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        },
        "mocha": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        },
        "cypress": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        }
    },

    "elixir": {
        "exunit": {
            "command": null,
            "docker": {
                "rootDirectory": null,
            }
        }
    }
}
```

Notes for this file:

* Add this file your `.gitignore`
* Any languages that you do not use can be omitted

## Running in the commands manually

If you are using the extension and do not want to set up keybindings, you will need to run the commands manually. To do so:

- Press Ctrl + Shift + P
- Begin a search for "Agnostic Test"
- Select the desired command from the dropdown selection

## Notes for Docker users

Docker containers often have a different view of the project structure compared to the host system. By specifying the `rootDirectory`, the testing framework can accurately locate and run tests within each container's context.

Assume a project with this structure:

```sh
.
├── README.md
├── backend/
├── docker-compose.override.yml
├── docker-compose.yml
├── frontend/
└── nginx/
```

- `backend/`: Elixir application with ExUnit tests
- `frontend/`: Nuxt application with Vitest

### Configuration file: `.testrc.json`

Create a `.testrc.json` file in your project root to configure testing:

```json
{
  "elixir": {
    "exunit": {
      "command": "docker compose exec -e MIX_ENV=test backend mix test",
      "docker": {
        "rootDirectory": "backend/"
      }
    }
  },
  "javascript": {
    "vitest": {
      "command": "docker compose exec frontend npm run test",
      "docker": {
        "rootDirectory": "frontend/"
      }
    }
  }
}
```

### Key Points

1. Docker-aware commands: The `command` fields use `docker compose exec` to run tests inside the respective containers.
1. `docker.rootDirectory`: This setting specifies the relative path to the root directory of each Docker container within the project structure.
  - For backend: `"rootDirectory": "backend/"`
  - For frontend: `"rootDirectory": "frontend/"`
1. Path adjustment: When tests run, the `rootDirectory` path is automatically removed from test commands. This ensures tests execute in the correct context within each container.

## Currently Supported Testing Frameworks

Pull requests are welcome for new languages or frameworks. Due to limited familiarity with other languages, it is preferred that any new language support also comes with test coverage.

At the moment, the following languages are supported:

### PHP

- PHPUnit
- Pest

### JavaScript

- Cypress - If a test runner encounters the string `cy.` in the test file, it will run Cypress tests.
- Jest
- Mocha

### Elixir

- ExUnit

## Requirements

This extension does not have any dependencies; however, the framework you are utilizing for testing likely will. Please refer to the documentation for your test framework for installation within your project.

## Expectations

Although there are configuration options for Agnostic Test, there are still assumptions it makes when running test commands in your project. It expects:

- Your VSCode workspace is the root of the project
- Your file name, and secondly, your package manager's dependencies, are enough to determine the test being run
- You are only using one testing framework for the same file type. So, for example: if you use both `Mocha` and `Jest` in a JavaScript project, Agnostic Test will have trouble distinguishing which test runner to use for any `.js` extensions.

### Runner-specific Issues

#### Cypress

- It is difficult to tell if an entire suite should be run with the Cypress runner. This _could_ be done by testing that the file path of the suite is in the `/cypress` folder, but I'm personally not a fan of that convention, and I think it's going a bit **too** far in the "convention over configuration" route.

## Prior Art

- VS Test - https://github.com/ignu/vs-test
- test.vim - https://github.com/vim-test/vim-test
- Better PHPUnit - https://github.com/calebporzio/better-phpunit
