# Change Log

All notable changes to the "agnostic-test" extension will be documented in this file.

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
