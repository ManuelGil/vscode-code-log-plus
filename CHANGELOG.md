# Change Log

All notable changes to the "CodeLog+" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.0] - 2025-07-17

### Added

- Add `inflector.helper.ts` with functions for `camelCase`, `PascalCase`, `snake_case`, and more.
- Add `text.helper.ts` for escaping special characters in regex.
- Add `NodeModel` class to represent files and folders in the workspace tree.
- Implement `ListLogProvider` to handle the display and interaction with log files.
- Add `getLogCommand` method to `LogService` for better command management.
- Add accessibility option `useAccessibleLogs` to replace emojis with text alternatives in log messages, improving screen reader compatibility

### Changed

- Integrate with `LogService` to fetch and display log entries.
- Update log message handling to support accessible prefixes for emojis.
- Improve workspace folder selection and persistence in global state.
- Implement progress indicators for long-running operations on large files to enhance user experience

## [1.6.0] - 2025-03-16

### Added

- Add context menu option to insert log statements in the active editor

## [1.5.1] - 2025-03-09

### Fixed

- Improve localization strings for extension messages

## [1.5.0] - 2025-03-09

### Added

- Add cursor position handling for gets the variable name in the active editor
- Add vscode marketplace client dependency for version checks

### Changed

- Update Localization strings for the extension

## [1.4.0] - 2025-03-03

### Added

- Add auto-detection of language in the active editor for log statements
- Add edit logs command to edit log statements in the active editor

### Changed

- Refactor highlighter controller to improve handling of log statements

## [1.3.0] - 2025-03-02

### Added

- Add the `functionName` variable to the log statement templates

### Changed

- Refactor log service to improve template handling and use of settings for log statements

## [1.2.1] - 2025-02-26

### Fixed

- Fix issue with highlighting mechanism when using custom colors

## [1.2.0] - 2025-02-25

### Added

- Add highlight color and style settings for log statements

## [1.1.0] - 2025-02-14

### Added

- Add literal open and close settings for log statements

## [1.0.1] - 2025-02-14

### Fixed

- Ensure content ends with a newline in log service

## [1.0.0] - 2025-02-14

### Added

- Initial release of codeLog+ extension

[Unreleased]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.7.0...HEAD
[1.7.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.1.0...v1.2.0
[1.1.0]: https.//github.com/ManuelGil/vscode-code-log-plus/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ManuelGil/vscode-code-log-plus/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ManuelGil/vscode-code-log-plus/releases/tag/v1.0.0
