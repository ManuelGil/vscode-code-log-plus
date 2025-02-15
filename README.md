# CodeLog+

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-code-log-plus?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/LICENSE)

## Overview

**CodeLog+** is a powerful Visual Studio Code extension designed to streamline debugging by dynamically inserting log statements. It provides customizable log templates tailored for multiple programming languages, enabling structured and efficient debugging workflows.

![CodeLog+ Demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/code-log-plus.gif)

## Table of Contents

- [CodeLog+](#codelog)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Inserting a Log Statement](#inserting-a-log-statement)
    - [Removing Log Statements](#removing-log-statements)
  - [Configuration](#configuration)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Example Usage](#example-usage)
    - [JavaScript Log Output Example](#javascript-log-output-example)
    - [Python Log Output Example](#python-log-output-example)
  - [Follow Me](#follow-me)
  - [VSXpert Template](#vsxpert-template)
  - [Other Extensions](#other-extensions)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [License](#license)

## Features

- **Multi-Language Support**: Automatically inserts logs using appropriate syntax for JavaScript, Python, Dart, C#, Java, and more.
- **Customizable Log Templates**: Define personalized log formats, including variables such as filename, line number, and variable name.
- **Smart Log Formatting**: Control message structure with prefixes, delimiters, and suffixes.
- **Advanced Context Awareness**: Optionally include enclosing class or function details in log messages.
- **Configurable Settings**: Supports global and workspace-level configurations for flexibility.
- **Efficient Log Management**: Insert, comment, uncomment, or remove log statements instantly.

## Installation

1. Open **VS Code**.
2. Go to the **Extensions Marketplace** (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for `CodeLog+` and click **Install**.
4. Reload VS Code if necessary.

## Usage

### Inserting a Log Statement

1. Place your cursor on a variable or statement.
2. Use the shortcut (`Ctrl+Alt+L` / `Cmd+Alt+L` on macOS) or execute `CodeLog+: Insert Log` via the command palette (`Ctrl+Shift+P`).
3. The log statement is inserted based on your configured template.

### Removing Log Statements

- Press (`Ctrl+Alt+Shift+L` / `Cmd+Alt+Shift+L`) to remove all log statements in the file.
- Use `CodeLog+: Remove All Logs` in the command palette.

## Configuration

Modify `settings.json` to customize CodeLog+:

```json
{
  "codeLogPlus.enable": true,
  "codeLogPlus.defaultLanguage": "javascript",
  "codeLogPlus.logCommand": "console.log",
  "codeLogPlus.logMessagePrefix": "🔍",
  "codeLogPlus.messageLogDelimiter": "~",
  "codeLogPlus.isSemicolonRequired": false,
  "codeLogPlus.customLogTemplates": [
    {
      "language": "javascript",
      "template": "{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{{filename}}}:{{lineNumber}} → {{variableName}}{{{quote}}});"
    },
    {
      "language": "python",
      "template": "{{logCommand}}({{{quote}}}{{logMessagePrefix}}{{{filename}}}:{{lineNumber}} → {{variableName}}{{{quote}}})"
    }
  ]
}
```

## Keyboard Shortcuts

| Function           | Windows/Linux | macOS |
|-------------------|--------------|-------|
| Insert Log       | `Ctrl+Alt+L`  | `Cmd+Alt+L`  |
| Remove All Logs  | `Ctrl+Alt+Shift+L` | `Cmd+Alt+Shift+L` |
| Highlight Logs   | `Ctrl+Alt+K` | `Cmd+Alt+K` |
| Clear Highlights | `Ctrl+Alt+Shift+K` | `Cmd+Alt+Shift+K` |
| Comment Logs     | `Ctrl+Alt+,` | `Cmd+Alt+,` |
| Uncomment Logs   | `Ctrl+Alt+Shift+,` | `Cmd+Alt+Shift+,` |

## Example Usage

### JavaScript Log Output Example

```js
console.log("🔍 myFile.js:25 → userName");
```

### Python Log Output Example

```python
print("🔍 myFile.py:25 → userName")
```

## Follow Me

Stay updated on the latest features, improvements, and future projects by following me:

- [GitHub](https://github.com/ManuelGil)
- [Twitter (X)](https://twitter.com/imgildev)

## VSXpert Template

This extension was created using [VSXpert](https://vsxpert.com), a template designed to help you quickly create Visual Studio Code extensions with ease.

## Other Extensions

Explore other extensions developed by me:

- [Angular File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-angular-generator)
- [NestJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
- [T3 Stack / NextJS / ReactJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nextjs-generator)
- [JSON Flow](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-json-flow)
- [Auto Barrel](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-auto-barrel)
- [CodeIgniter 4 Spark](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-spark)

## Contributing

We welcome contributions from the community! To contribute, fork the [GitHub repository](https://github.com/ManuelGil/vscode-code-log-plus) and submit a pull request.

Before contributing, please review our [Contribution Guidelines](./CONTRIBUTING.md) for details on coding standards and best practices.

## Code of Conduct

We strive to create a welcoming, inclusive, and respectful environment for all contributors. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating in this project.

## Changelog

See the full list of changes in the [CHANGELOG.md](./CHANGELOG.md) file.

## License

This extension is licensed under the MIT License. See the [MIT License](https://opensource.org/licenses/MIT) for more details.
