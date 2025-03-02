# CodeLog+

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-code-log-plus?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/LICENSE)

## Overview

**CodeLog+** is a powerful and customizable VSCode extension designed to streamline debugging by quickly inserting formatted log statements into your code. This extension supports multiple programming languages and allows you to configure templates to match your preferred logging style.

![CodeLog+ Demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/code-log-plus.gif)

## Table of Contents

- [CodeLog+](#codelog)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Insert a Log Statement](#insert-a-log-statement)
    - [JavaScript Log Output Example](#javascript-log-output-example)
    - [Python Log Output Example](#python-log-output-example)
  - [Configuration Options](#configuration-options)
    - [General Settings](#general-settings)
    - [Supported Languages](#supported-languages)
    - [Custom Log Templates](#custom-log-templates)
    - [Template Variables](#template-variables)
    - [Considerations for Template Creation](#considerations-for-template-creation)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Support](#support)
  - [Feedback](#feedback)
  - [Follow Me](#follow-me)
  - [VSXpert Template](#vsxpert-template)
  - [Other Extensions](#other-extensions)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [License](#license)

## Features

- **Multi-language support** - Works with JavaScript, TypeScript, Java, C#, PHP, Dart, Python, C++, Ruby, and Go.
- **Customizable log templates** - Define your own log message format.
- **Automatic file & line detection** - Inserts file name and line number dynamically.
- **Quick insert with shortcuts** - Add log statements with minimal effort.
- **Intelligent variable logging** - Automatically logs variable names and values.
- **Flexible configuration options** - Tailor the behavior to your needs.

## Installation

1. Open **VSCode**.
2. Go to **Extensions** (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for `CodeLog+`.
4. Click **Install**.
5. Start using it right away!

## Usage

### Insert a Log Statement

1. Place your cursor on a variable or function.
2. Use the shortcut:
   - **Windows/Linux**: `Ctrl+Alt+L`
   - **Mac**: `Cmd+Option+L`
3. A formatted log statement will be inserted automatically.

### JavaScript Log Output Example

```js
console.log("🔍 ~ myFile.js:25 ~ userName:", userName)
```

### Python Log Output Example

```python
print(f"🔍 ~ myFile.py:25 ~ userName: {userName}")
```

## Configuration Options

CodeLog+ provides various configuration options to customize logging behavior in VSCode. You can modify these settings in the VSCode `settings.json` file.

### General Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `codeLogPlus.enable` | boolean | `true` | Enables or disables CodeLog+ features. |
| `codeLogPlus.defaultLanguage` | string | `javascript` | Default language for log statements. |
| `codeLogPlus.logCommand` | string | `console.log` | The command used for logging. |
| `codeLogPlus.isLogMessageWrapped` | boolean | `false` | Determines whether log messages should be wrapped. |
| `codeLogPlus.logMessagePrefix` | string | `🔍` | Prefix for log messages. |
| `codeLogPlus.messageLogDelimiter` | string | `~` | Delimiter for log messages. |
| `codeLogPlus.messageLogSuffix` | string | `:` | Suffix for log messages. |
| `codeLogPlus.isSemicolonRequired` | boolean | `false` | Whether a semicolon should be added at the end of log statements. |
| `codeLogPlus.addEmptyLineBeforeLogMessage` | boolean | `false` | Adds an empty line before log statements. |
| `codeLogPlus.addEmptyLineAfterLog` | boolean | `false` | Adds an empty line after log statements. |
| `codeLogPlus.useSingleQuotes` | boolean | `false` | Uses single quotes for strings in log messages. |
| `codeLogPlus.literalOpen` | string | `{` | Character(s) used to open template literals. |
| `codeLogPlus.literalClose` | string | `}` | Character(s) used to close template literals. |
| `codeLogPlus.highlightColor` | string | `"#FFD700"` | Color used for highlighting log statements. |
| `codeLogPlus.highlightStyle` | string | `"wavy"` | Style used for highlighting log statements. |
| `codeLogPlus.customLogTemplates` | array | `[]` | Custom log templates for different languages. |

### Supported Languages

CodeLog+ supports multiple programming languages for log generation:

- **JavaScript (`javascript`)**
- **TypeScript (`typescript`)**
- **Java (`java`)**
- **C# (`csharp`)**
- **PHP (`php`)**
- **Dart (`dart`)**
- **Python (`python`)**
- **C++ (`cpp`)**
- **Ruby (`ruby`)**
- **Go (`go`)**

### Custom Log Templates

Users can define custom log templates using Mustache syntax. Example:

```json
"codeLogPlus.customLogTemplates": [
  {
    "language": "javascript",
    "template": "{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{fileName}}}:{{{lineNumber}}} → {{{variableName}}}{{{quote}}});\n"
  },
  {
    "language": "python",
    "template": "{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{fileName}}}:{{{lineNumber}}} → {{{variableName}}}{{{quote}}})\n"
  }
]
```

### Template Variables

When defining custom templates, you can use the following variables:

| Variable | Description |
|----------|-------------|
| `indent` | The indentation level of the log statement. |
| `logCommand` | The logging command (e.g., `console.log`, `print`). |
| `quote` | Single or double quotes based on settings. **Escape this value to prevent HTML entity conversion.** |
| `logMessagePrefix` | The prefix set for log messages. |
| `messageLogDelimiter` | The delimiter between log elements. |
| `fileName` | The name of the file where the log is inserted. **Escape this value to prevent HTML entity conversion.** |
| `lineNumber` | The line number where the log is inserted. |
| `functionName` | The name of the function where the log is inserted. |
| `variableName` | The name of the variable being logged. |
| `messageLogSuffix` | The suffix added to log messages. |
| `literalOpen` | The opening character(s) for template literals. |
| `literalClose` | The closing character(s) for template literals. |

### Considerations for Template Creation

- **Escape special characters**: Variables like `quote` and `fileName` may be converted into HTML entities. Use appropriate escaping mechanisms to avoid issues.
- **Ensure syntax correctness**: Different languages require different concatenation methods (`+` for Java, `.` for PHP, etc.).
- **Use delimiters wisely**: The `messageLogDelimiter` setting helps maintain readable logs across different formats.

By customizing these options, you can tailor CodeLog+ to fit your workflow seamlessly.

## Keyboard Shortcuts

| Function           | Windows/Linux | macOS |
|-------------------|--------------|-------|
| Insert Log       | `Ctrl+Alt+L`  | `Cmd+Alt+L`  |
| Remove All Logs  | `Ctrl+Alt+Shift+L` | `Cmd+Alt+Shift+L` |
| Highlight Logs   | `Ctrl+Alt+K` | `Cmd+Alt+K` |
| Clear Highlights | `Ctrl+Alt+Shift+K` | `Cmd+Alt+Shift+K` |
| Comment Logs     | `Ctrl+Alt+,` | `Cmd+Alt+,` |
| Uncomment Logs   | `Ctrl+Alt+Shift+,` | `Cmd+Alt+Shift+,` |

You can also customize these shortcuts in the VSCode settings.

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/ManuelGil/vscode-code-log-plus/issues) on GitHub.

## Feedback

If you enjoy using CodeLog+, please consider leaving a review on the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus).

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
