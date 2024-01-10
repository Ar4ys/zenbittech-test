import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  trailingComma: 'all',
  arrowParens: 'always',
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  importOrderTypeScriptVersion: '5.3.2',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: [
    '<BUILT_IN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@repo/',
    '',
    '^@/',
    '',
    '^[./]',
  ],
  plugins: [
    require.resolve('@ianvs/prettier-plugin-sort-imports'),
    require.resolve('prettier-plugin-jsdoc'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
};
