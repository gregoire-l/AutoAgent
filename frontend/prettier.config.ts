import { type Config } from 'prettier';

const config: Config = {
  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Line length
  printWidth: 80,

  // Quotes
  singleQuote: true,
  jsxSingleQuote: true,

  // Semicolons
  semi: true,

  // Trailing commas
  trailingComma: 'es5',

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'avoid',

  // End of line
  endOfLine: 'lf',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Overrides for specific file types
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
  ],
};

export default config;
