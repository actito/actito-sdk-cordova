import { defineConfig, globalIgnores } from 'eslint/config';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import jsEslint from '@eslint/js';

export default defineConfig([
  jsEslint.configs.recommended,
  tsEslint.configs.recommended,
  globalIgnores(['**/build/']),
  {
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-undef': 'off',
    },
  },
]);
