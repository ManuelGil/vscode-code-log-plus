/**
 * Represents a log template for a specific language.
 */
export interface LogTemplate {
  language: string;
  template: string;
}

/**
 * A list of default log templates for various languages.
 */
export const defaultTemplates: LogTemplate[] = [
  {
    language: 'javascript',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}});\n',
  },
  {
    language: 'typescript',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}});\n',
  },
  {
    language: 'java',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
  },
  {
    language: 'csharp',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
  },
  {
    language: 'php',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} . {{{variableName}}});\n',
  },
  {
    language: 'dart',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
  },
  {
    language: 'python',
    template:
      '{{{indent}}}{{{logCommand}}}(f{{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{literalOpen}}}{{{variableName}}}{{{literalClose}}}{{{messageLogSuffix}}}{{{quote}}});\n',
  },
  {
    language: 'cpp',
    template:
      '{{{indent}}}{{{logCommand}}} << {{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} << {{{variableName}}} << std::endl;\n',
  },
  {
    language: 'ruby',
    template:
      '{{{indent}}}{{{logCommand}}} {{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}};\n',
  },
  {
    language: 'go',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, {{{variableName}}});\n',
  },
  {
    language: 'kotlin',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
  },
  {
    language: 'swift',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}, \\({{{variableName}}}}));\n',
  },
  {
    language: 'scala',
    template:
      '{{{indent}}}{{{logCommand}}}(s{{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} + {{{variableName}}});\n',
  },
  {
    language: 'lua',
    template:
      '{{{indent}}}{{{logCommand}}}({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} .. {{{variableName}}}});\n',
  },
  {
    language: 'perl',
    template:
      '{{{indent}}}{{{logCommand}}} {{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} . {{{variableName}}};\n',
  },
  {
    language: 'elixir',
    template:
      '{{{indent}}}IO.puts({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}} <> to_string({{{variableName}}}));\n',
  },
  {
    language: 'haskell',
    template:
      '{{{indent}}}{{{logCommand}}} (({{{quote}}}{{{logMessagePrefix}}}{{{messageLogDelimiter}}}{{{functionName}}}{{{messageLogDelimiter}}}{{{fileName}}}:{{{lineNumber}}}{{{messageLogDelimiter}}}{{{variableName}}}{{{messageLogSuffix}}}{{{quote}}}) ++ show {{{variableName}}});\n',
  },
];
