/**
 * Defines a map of language identifiers to their corresponding log commands.
 */
export interface LogCommandMap {
  [language: string]: string;
}

/**
 * A map of default log commands for each supported language.
 */
export const defaultLogCommand: LogCommandMap = {
  javascript: 'console.log',
  typescript: 'console.log',
  java: 'System.out.println',
  csharp: 'Console.WriteLine',
  php: 'echo',
  dart: 'print',
  python: 'print',
  cpp: 'std::cout',
  ruby: 'puts',
  go: 'fmt.Println',
  kotlin: 'println',
  swift: 'print',
  scala: 'println',
  lua: 'print',
  perl: 'print',
  elixir: 'IO.puts',
  haskell: 'putStrLn',
};
