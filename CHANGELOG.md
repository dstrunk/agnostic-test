# Change Log

All notable changes to the "agnostic-test" extension will be documented in this file.

## [1.0.0]

Officially calling it ... 1.0.0 :confetti:

### Enhancement

- After running tests, return focus to the previous window so users can continue editing code.

## [0.8.1]
### Fixed
- Issue where custom commands were not running as expected.

## [0.8.0]
### Enhancement

- Docker configs for every test runner; if a `docker.rootDirectory` exists for the test runner, Agnostic Test will remove the directory from the test command when running the command. Best used in conjunction with `[runner].command`. See the README for more information.

### Changed

- All test runners now use a relative directory if one can be parsed, with fallbacks to full paths if a relative directory cannot be used.
- Version bumps across the board to bring this project up-to-date
- ESLint GitHub Workflow


## [0.7.0]
### Enhancement

- Vitest support
- Add past `CHANGELOG.md` entries before they leave my brain forever
- Add tests :confetti:

### Added

- Test GitHub Workflow

## [0.6.1]
### Fixed

- `0.6.0` was pushed to the VSCode Marketplace without 0.6.0 features :facepalm:

## [0.6.0]
### Enhancement

- Add Docker config for ExUnit; if a Docker `rootDirectory` is supplied, ExUnit will attempt to strip this directory from the relative test file path when running the test. Use case:
    - Your project is a Docker Compose project, where each subdirectory contains a different Docker container
    - Your command is configured to run something like `docker compose exec backend mix test`
    - ExUnit needs to be filtered using the relative path directory. Seeing `backend/test/foo/test.exs`, it _would_ have run `docker compose exec backend mix test backend/test/foo/test.exs`, but the command being run in the Docker container does not include `backend`, since the root of that container likely does not include the full directory of the Docker Compose structure, only the subdirectory of the single container.
    - Adding `docker.rootDirectory: backend` will now run `docker compose exec backend mix test test/foo/test.exs`. :thumbsup:

## [0.5.0]
### Fixed

- Add `--only` argument to ExUnit commands for testing files and individual tests
- Add relative file path for ExUnit tests

## [0.4.0]
### Enhancement

- Instead of a testing `composer.json` to search for _any_ string that includes "pest", parse the JSON and check the `require-dev` key directly. This assumes a project has the pest (or PHPUnit) package installed as a dev dependency, but this is a solid convention.

## [0.1.1]
### Fixed

- Remove white background from icon

## [0.1.0]
### Added

- PHP Pest support
- Agnostic Test logo
- "Testing" category for easier search on the VS Code extension directory

### Fixed

- focused test runs for Jest

## [0.0.2]

- Initial release
- Added PHPUnit support
- Added ExUnit support
- Added Jest support
- Added Cypress support
