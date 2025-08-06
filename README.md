# CodeLog+

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-code-log-plus?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-code-log-plus?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-code-log-plus?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/LICENSE)

> A VS Code extension to streamline debugging by inserting and managing formatted log statements across multiple languages.

## Overview

CodeLog+ accelerates debugging by providing:

- Instant insertion of formatted log statements for JavaScript, Python, Java, C#, PHP, Dart, Go, C++, Ruby, and more
- Customizable templates, prefixes, delimiters, and accessibility-friendly modes
- Bulk operations: edit, comment/uncomment, remove, and highlight logs
- Workspace-wide Tree View for navigating all log statements
- Progress indicators and performance optimizations for large codebases

![Animated demo of CodeLog+ in VS Code. A user places the cursor on a variable and uses a keyboard shortcut to insert a formatted log statement with file name, line number, and variable name.](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/add-log-statement.gif)

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
  - [File-Scope Log Management](#file-scope-log-management)
    - [Edit Logs](#edit-logs)
    - [Comment \& Uncomment Logs](#comment--uncomment-logs)
    - [Remove Logs](#remove-logs)
    - [Highlight \& Clear Highlights](#highlight--clear-highlights)
  - [Workspace-Wide Log Navigator](#workspace-wide-log-navigator)
    - [Accessibility Features](#accessibility-features)
    - [Progress Indicators](#progress-indicators)
  - [Configuration Options](#configuration-options)
    - [General Settings](#general-settings)
    - [Supported Languages](#supported-languages)
    - [Custom Log Templates](#custom-log-templates)
    - [Template Variables](#template-variables)
    - [Considerations for Template Creation](#considerations-for-template-creation)
  - [Complete Usage Guide](#complete-usage-guide)
    - [Basic Workflow](#basic-workflow)
    - [Log Statement Anatomy](#log-statement-anatomy)
    - [Working with Projects](#working-with-projects)
    - [Integration with Development Workflow](#integration-with-development-workflow)
  - [Technical Architecture](#technical-architecture)
    - [Core Components](#core-components)
    - [Performance Optimizations](#performance-optimizations)
    - [Extensibility](#extensibility)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues and Solutions](#common-issues-and-solutions)
      - [Log Tree View Not Refreshing](#log-tree-view-not-refreshing)
      - [Performance Issues in Large Projects](#performance-issues-in-large-projects)
      - [Maximum Call Stack Size Exceeded](#maximum-call-stack-size-exceeded)
      - [Log Command Not Working for a Specific Language](#log-command-not-working-for-a-specific-language)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [Authors](#authors)
  - [Follow Me](#follow-me)
  - [Other Extensions](#other-extensions)
  - [Recommended Browser Extension](#recommended-browser-extension)
  - [License](#license)

## Features

- **Multi-language support** - Works with JavaScript, TypeScript, Java, C#, PHP, Dart, Python, C++, Ruby, Go, Kotlin, Swift, Scala, Lua, Perl, Elixir, Haskell, and more.
- **Customizable log templates** - Define your own log message format.
- **Automatic file & line detection** - Inserts file name and line number dynamically.
- **Quick insert with shortcuts** - Add log statements with minimal effort.
- **Intelligent variable logging** - Automatically logs variable names and values.
- **Flexible configuration options** - Tailor the behavior to your needs.
- **Accessibility features** - Option to replace emoji prefixes with text alternatives for better screen reader compatibility.
- **Progress indicators** - Visual feedback during long-running operations on large files.
- **Tree view navigation** - Easily find and jump to log statements in your workspace.
- **Performance optimized** - Efficiently handles large codebases with minimal impact on VSCode's responsiveness.
- **Multi-root workspace support** - Works seamlessly across all folders in multi-root workspaces.

## Installation

1. Open **Visual Studio Code** (or a compatible editor).
2. Go to **Extensions** (Ctrl+Shift+X / ⌘+Shift+X).
3. Search for **CodeLog+** or install directly from the [Market­place](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-code-log-plus).
4. Click **Install** and reload the editor.

## Usage

### Insert a Log Statement

1. Place your cursor on a variable or function.
2. Use the shortcut:
   - **Windows/Linux**: `Ctrl+Alt+L`
   - **Mac**: `⌘+Option+L`
3. A formatted log statement will be inserted automatically.

### JavaScript Log Output Example

```js
console.log("🔍 ~ myFile.js:25 ~ userName:", userName)
```

### Python Log Output Example

```python
print(f"🔍 ~ myFile.py:25 ~ userName: {userName}")
```

## File-Scope Log Management

Bulk-operate on every `log` statement in the currently active file, no manual searching, no regex gymnastics. Simply open the Command Palette (`Ctrl+Shift+P` / `⌘+Shift+P`), type **CodeLog+**, and choose your action.

### Edit Logs

**Purpose:** Standardize or change log methods in one sweep.

- **What it does:**
  - Converts between methods (e.g. `console.log` → `console.error` → `console.warn`)
  - Inserts/removes custom prefixes or timestamps
  - Wraps messages in your team's agreed format
- **How to run:**
  - **Windows/Linux:** `Ctrl+Alt+A`
  - **macOS:** `⌘+Alt+A`
- **Animated Demo:**
  ![Edit logs demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/edit-log-statement.gif)

### Comment & Uncomment Logs

**Purpose:** Temporarily mute or restore debug output without deleting code.

- **Comment Logs:**
  - **Windows/Linux:** `Ctrl+Alt+,`
  - **macOS:** `⌘+Alt+,`
  - Wraps each `log` line in a comment (e.g. `// console.log(...)`)
- **Uncomment Logs:**
  - **Windows/Linux:** `Ctrl+Alt+Shift+,`
  - **macOS:** `⌘+Alt+Shift+,`
  - Reverts commented logs back to active statements
- **When to use:** Toggle debug noise during iterative testing or peer review.
- **Animated Demo:**
  ![Comment logs demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/comment-log-statement.gif)

### Remove Logs

**Purpose:** Clean slate, strip out all `log` statements before merging or shipping.

- **Shortcut:**
  - Windows/Linux: `Ctrl+Alt+Shift+L`
  - macOS: `⌘+Alt+Shift+L`
- **Behavior:**
  - Deletes any line containing a recognized log command
  - Preserves surrounding code structure and formatting
- **Animated Demo:**
  ![Remove logs demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/remove-log-statement.gif)

### Highlight & Clear Highlights

**Purpose:** Visually surface every `log` statement for quick scanning, then clear highlights to restore your normal color scheme.

- **Highlight Logs:**
  - **Windows/Linux:** `Ctrl+Alt+K`
  - **macOS:** `⌘+Alt+K`
  - Applies a customizable decoration (e.g. wavy underline, background color) to each `log` line
- **Clear Highlights:**
  - **Windows/Linux:** `Ctrl+Alt+Shift+K`
  - **macOS:** `⌘+Alt+Shift+K`
  - Removes all decorations, returning to default syntax highlighting
- **Animated Demo:**
  ![Highlight logs demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/highlight-log-statement.gif)

## Workspace-Wide Log Navigator

Navigate every debug statement across your entire workspace with a single sidebar panel:

- **Hierarchical Explorer**
  - Logs are grouped by file
  - Collapsible nodes let you drill down to specific files
- **Instant Jump-To-Code**
  - Click any entry to open the file and position your cursor exactly at the log statement

![Tree view demo](https://raw.githubusercontent.com/ManuelGil/vscode-code-log-plus/main/images/tree-view.gif)

### Accessibility Features

CodeLog+ supports improved accessibility with the `useAccessibleLogs` setting:

```json
"codeLogPlus.useAccessibleLogs": true
```

When enabled, emoji prefixes in log statements are replaced with text alternatives:

| Emoji | Text Alternative |
| ----- | ---------------- |
| 🔍     | [DEBUG]          |
| ℹ️     | [INFO]           |
| ⚠️     | [WARNING]        |
| ❌     | [ERROR]          |

This improves compatibility with screen readers and provides clearer information in environments where emojis may not render correctly.

**Example with accessibility enabled:**

Standard log: `console.log("🔍 ~ file.js:25 ~ functionName: variable")`

Accessible log: `console.log("[DEBUG] ~ file.js:25 ~ functionName: variable")`

### Progress Indicators

When working with large files, long-running operations like finding, editing, or removing logs can take time. CodeLog+ now provides visual progress indicators during these operations:

- **Finding logs** shows a "Searching for log statements..." notification
- **Removing logs** displays a "Removing selected logs..." notification
- **Editing logs** shows an "Updating log statements..." notification
- **Commenting/uncommenting logs** displays appropriate progress notifications

These indicators help you understand when operations are in progress and when they complete, especially in large codebases.

## Configuration Options

CodeLog+ provides various configuration options to customize logging behavior in VSCode. You can modify these settings in the VSCode `settings.json` file.

### General Settings

| Setting                                       | Type    | Default                                                                            | Description                                                                                 |
| --------------------------------------------- | ------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `codeLogPlus.enable`                          | boolean | `true`                                                                             | Enables or disables CodeLog+ features.                                                      |
| `codeLogPlus.defaultLanguage`                 | string  | `javascript`                                                                       | Default language for log statements.                                                        |
| `codeLogPlus.logCommand`                      | string  | `console.log`                                                                      | The command used for logging.                                                               |
| `codeLogPlus.isLogMessageWrapped`             | boolean | `false`                                                                            | Determines whether log messages should be wrapped.                                          |
| `codeLogPlus.borderWrapCharacter`             | string  | `"-"`                                                                              | Character used to draw the border in log wraps.                                             |
| `codeLogPlus.borderWrapLength`                | number  | `20`                                                                               | Number of times the border character is repeated to create a border line.                   |
| `codeLogPlus.logMessagePrefix`                | string  | `🔍`                                                                                | Prefix for log messages.                                                                    |
| `codeLogPlus.useAccessibleLogs`               | boolean | `false`                                                                            | Replaces emoji prefixes with text alternatives for accessibility (e.g., 🔍 becomes [DEBUG]). |
| `codeLogPlus.messageLogDelimiter`             | string  | `~`                                                                                | Delimiter for log messages.                                                                 |
| `codeLogPlus.messageLogSuffix`                | string  | `:`                                                                                | Suffix for log messages.                                                                    |
| `codeLogPlus.isSemicolonRequired`             | boolean | `true`                                                                             | Whether a semicolon should be added at the end of log statements.                           |
| `codeLogPlus.addEmptyLineBeforeLogMessage`    | boolean | `false`                                                                            | Adds an empty line before log statements.                                                   |
| `codeLogPlus.addEmptyLineAfterLog`            | boolean | `false`                                                                            | Adds an empty line after log statements.                                                    |
| `codeLogPlus.useSingleQuotes`                 | boolean | `false`                                                                            | Uses single quotes for strings in log messages.                                             |
| `codeLogPlus.literalOpen`                     | string  | `{`                                                                                | Character(s) used to open template literals.                                                |
| `codeLogPlus.literalClose`                    | string  | `}`                                                                                | Character(s) used to close template literals.                                               |
| `codeLogPlus.highlightColor`                  | string  | `"#FFD700"`                                                                        | Color used for highlighting log statements.                                                 |
| `codeLogPlus.highlightStyle`                  | string  | `"wavy"`                                                                           | Style used for highlighting log statements.                                                 |
| `codeLogPlus.customLogTemplates`              | array   | `[]`                                                                               | Custom log templates for different languages.                                               |
| `codeLogPlus.files.includedFilePatterns`      | array   | `["**/*.{js,jsx,ts,tsx}"]`                                                         | Glob patterns for files to include in the extension's file operations.                      |
| `codeLogPlus.files.excludedFilePatterns`      | array   | `["**/node_modules/**", "**/dist/**", "**/out/**", "**/build/**", "**/vendor/**"]` | Glob patterns for files to exclude from the extension's file operations.                    |
| `codeLogPlus.files.maxSearchRecursionDepth`   | number  | `0`                                                                                | Maximum recursion depth for file search (0 = unlimited).                                    |
| `codeLogPlus.files.supportsHiddenFiles`       | boolean | `true`                                                                             | Whether to include hidden files in search operations.                                       |
| `codeLogPlus.files.preserveGitignoreSettings` | boolean | `false`                                                                            | Whether to respect .gitignore settings during file search.                                  |
| `codeLogPlus.files.includeFilePath`           | boolean | `true`                                                                             | Whether to show the file path in the search results.                                        |

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
- **Kotlin (`kotlin`)**
- **Swift (`swift`)**
- **Scala (`scala`)**
- **Lua (`lua`)**
- **Perl (`perl`)**
- **Elixir (`elixir`)**
- **Haskell (`haskell`)**

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

| Variable              | Description                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `indent`              | The indentation level of the log statement.                                                              |
| `logCommand`          | The logging command (e.g., `console.log`, `print`).                                                      |
| `quote`               | Single or double quotes based on settings. **Escape this value to prevent HTML entity conversion.**      |
| `logMessagePrefix`    | The prefix set for log messages.                                                                         |
| `messageLogDelimiter` | The delimiter between log elements.                                                                      |
| `fileName`            | The name of the file where the log is inserted. **Escape this value to prevent HTML entity conversion.** |
| `lineNumber`          | The line number where the log is inserted.                                                               |
| `functionName`        | The name of the function where the log is inserted.                                                      |
| `variableName`        | The name of the variable being logged.                                                                   |
| `messageLogSuffix`    | The suffix added to log messages.                                                                        |
| `literalOpen`         | The opening character(s) for template literals.                                                          |
| `literalClose`        | The closing character(s) for template literals.                                                          |

### Considerations for Template Creation

- **Escape special characters**: Variables like `quote` and `fileName` may be converted into HTML entities. Use appropriate escaping mechanisms to avoid issues.
- **Ensure syntax correctness**: Different languages require different concatenation methods (`+` for Java, `.` for PHP, etc.).
- **Use delimiters wisely**: The `messageLogDelimiter` setting helps maintain readable logs across different formats.

By customizing these options, you can tailor CodeLog+ to fit your workflow seamlessly.

## Complete Usage Guide

### Basic Workflow

CodeLog+ integrates seamlessly into your development workflow:

1. **Write Code**: Develop your application normally
2. **Insert Logs**: Use the shortcut (`Ctrl+Alt+L` / `⌘+Option+L`) to add logs at strategic points
3. **Debug**: Use the formatted logs to track execution and variable values
4. **Clean Up**: Use the bulk operations (comment, uncomment, remove) to manage logs

### Log Statement Anatomy

A standard CodeLog+ log statement includes:

- **Prefix**: An emoji or text indicator of the log type (customizable)
- **Delimiter**: A separator between components (default: `~`)
- **File information**: The source file name and line number
- **Context**: Function or method name when available
- **Variable**: The name and value of the variable being logged

### Working with Projects

CodeLog+ works across your entire workspace:

- Works with any supported language file in your project
- Maintains consistent log formats across files
- Automatically adapts to the language of each file
- Supports multi-root workspaces

### Integration with Development Workflow

CodeLog+ enhances your debugging process by:

- Providing consistent, informative logs across your codebase
- Allowing quick cleanup before committing code
- Supporting accessibility needs with configurable formats
- Offering performance enhancements for large files
- Enabling efficient navigation through log statements with the tree view
- Supporting internationalization with multi-language UI through VSCode's localization framework

## Technical Architecture

CodeLog+ is built with a modular architecture that ensures reliability and performance, even in large workspaces:

### Core Components

1. **Extension Core**
   - Handles VSCode extension lifecycle events
   - Registers commands, providers, and event handlers
   - Manages configuration and user preferences

2. **Controllers**
   - `LogController`: Manages inserting, modifying, and removing log statements
   - `ListLogController`: Handles file operations and tree node creation

3. **Providers**
   - `ListLogProvider`: Implements the TreeDataProvider interface for log navigation
   - Efficiently provides tree nodes for the VSCode sidebar

4. **Services**
   - `LogService`: Contains business logic for log manipulation
   - Handles language-specific formatting and log patterns

### Performance Optimizations

- **Efficient File Reading**: Uses direct file system access rather than VSCode's document API for better performance
- **Lazy Loading**: Loads log content only when needed to minimize memory usage
- **Smart Caching**: Remembers file structure to avoid unnecessary file operations
- **Event Debouncing**: Prevents excessive refreshes during rapid changes

### Extensibility

The extension is designed with extensibility in mind, allowing for:

- Easy addition of new languages through the configuration system
- Custom templates that can be defined by users
- Language-specific adaptations for optimal logging in each environment

## Troubleshooting

### Common Issues and Solutions

#### Log Tree View Not Refreshing

**Symptom**: The log tree view doesn't update after adding or modifying logs.
**Solution**: Use the `CodeLog+: Refresh list` command manually or ensure the extension is enabled in settings.

#### Performance Issues in Large Projects

**Symptom**: Slow performance or high CPU usage when using CodeLog+ in large projects.
**Solution**: Adjust the file patterns in settings to exclude unnecessary directories (like node_modules, build outputs, etc.).

#### Maximum Call Stack Size Exceeded

**Symptom**: Error message about "Maximum call stack size exceeded" when using the extension.
**Solution**: This has been fixed in recent versions. Make sure you're using the latest version of the extension.

#### Log Command Not Working for a Specific Language

**Symptom**: Log insertion doesn't work properly in certain file types.
**Solution**: Check if your language is supported. If it is, you might need to customize the log template for that specific language.

## Keyboard Shortcuts

| Function         | Windows/Linux      | macOS           |
| ---------------- | ------------------ | --------------- |
| Insert Log       | `Ctrl+Alt+L`       | `⌘+Alt+L`       |
| Edit Logs        | `Ctrl+Alt+A`       | `⌘+Alt+A`       |
| Remove All Logs  | `Ctrl+Alt+Shift+L` | `⌘+Alt+Shift+L` |
| Highlight Logs   | `Ctrl+Alt+K`       | `⌘+Alt+K`       |
| Clear Highlights | `Ctrl+Alt+Shift+K` | `⌘+Alt+Shift+K` |
| Comment Logs     | `Ctrl+Alt+,`       | `⌘+Alt+,`       |
| Uncomment Logs   | `Ctrl+Alt+Shift+,` | `⌘+Alt+Shift+,` |

You can also customize these shortcuts in the VSCode settings.

## Contributing

CodeLog+ is open-source and welcomes community contributions:

1. Fork the [GitHub repository](https://github.com/ManuelGil/vscode-code-log-plus).
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes, commit them, and push to your fork.
4. Submit a Pull Request against the `main` branch.

Before contributing, please review the [Contribution Guidelines](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/CONTRIBUTING.md) for coding standards, testing, and commit message conventions. Open an Issue if you find a bug or want to request a new feature.

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all, regardless of gender, sexual orientation, disability, ethnicity, religion, or other personal characteristic. Please review our [Code of Conduct](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/CODE_OF_CONDUCT.md) before participating in our community.

## Changelog

For a complete list of changes, see the [CHANGELOG.md](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/CHANGELOG.md).

## Authors

- **Manuel Gil** - _Owner_ - [@ManuelGil](https://github.com/ManuelGil)

See also the list of [contributors](https://github.com/ManuelGil/vscode-code-log-plus/contributors) who participated in this project.

## Follow Me

- **GitHub**: [![GitHub followers](https://img.shields.io/github/followers/ManuelGil?style=for-the-badge\&logo=github)](https://github.com/ManuelGil)
- **X (formerly Twitter)**: [![X Follow](https://img.shields.io/twitter/follow/imgildev?style=for-the-badge\&logo=x)](https://twitter.com/imgildev)

## Other Extensions

- **[Auto Barrel](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-auto-barrel)**
  Automatically generates and maintains barrel (`index.ts`) files for your TypeScript projects.

- **[Angular File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-angular-generator)**
  Generates boilerplate and navigates your Angular (9→20+) project from within the editor, with commands for components, services, directives, modules, pipes, guards, reactive snippets, and JSON2TS transformations.

- **[NestJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)**
  Simplifies creation of controllers, services, modules, and more for NestJS projects, with custom commands and Swagger snippets.

- **[NestJS Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-snippets-extension)**
  Ready-to-use code patterns for creating controllers, services, modules, DTOs, filters, interceptors, and more in NestJS.

- **[T3 Stack / NextJS / ReactJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nextjs-generator)**
  Automates file creation (components, pages, hooks, API routes, etc.) in T3 Stack (Next.js, React) projects and can start your dev server from VSCode.

- **[Drizzle ORM Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-drizzle-snippets)**
  Collection of code snippets to speed up Drizzle ORM usage, defines schemas, migrations, and common database operations in TypeScript/JavaScript.

- **[CodeIgniter 4 Spark](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-spark)**
  Scaffolds controllers, models, migrations, libraries, and CLI commands in CodeIgniter 4 projects using Spark, directly from the editor.

- **[CodeIgniter 4 Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-snippets)**
  Snippets for accelerating development with CodeIgniter 4, including controllers, models, validations, and more.

- **[CodeIgniter 4 Shield Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-shield-snippets)**
  Snippets tailored to CodeIgniter 4 Shield for faster authentication and security-related code.

- **[Mustache Template Engine - Snippets & Autocomplete](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-mustache-snippets)**
  Snippets and autocomplete support for Mustache templates, making HTML templating faster and more reliable.

## Recommended Browser Extension

For developers who work with `.vsix` files for offline installations or distribution, the complementary [**One-Click VSIX**](https://chromewebstore.google.com/detail/imojppdbcecfpeafjagncfplelddhigc?utm_source=item-share-cb) extension is recommended, available for both Chrome and Firefox.

> **One-Click VSIX** integrates a direct "Download Extension" button into each VSCode Marketplace page, ensuring the file is saved with the `.vsix` extension, even if the server provides a `.zip` archive. This simplifies the process of installing or sharing extensions offline by eliminating the need for manual file renaming.

- [Get One-Click VSIX for Chrome &rarr;](https://chromewebstore.google.com/detail/imojppdbcecfpeafjagncfplelddhigc?utm_source=item-share-cb)
- [Get One-Click VSIX for Firefox &rarr;](https://addons.mozilla.org/es-ES/firefox/addon/one-click-vsix/)

## License

This project is licensed under the **MIT License**. See the [LICENSE](https://github.com/ManuelGil/vscode-code-log-plus/blob/main/LICENSE) file for details.
