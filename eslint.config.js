import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'], // React 17+
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'eslint-comments': eslintComments,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      perfectionist,
      'react-hooks': reactHooks,
      unicorn,
    },
    rules: {
      // ESLint Comments
      'eslint-comments/no-unused-disable': 'error',
      // Import
      'import/no-unresolved': ['error', { ignore: ['@tailwindcss/vite'] }],
      'import/order': 'off', // evitamos conflicto con perfectionist

      // A11y
      'jsx-a11y/alt-text': 'warn',

      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',

      // Perfectionist
      'perfectionist/sort-imports': ['warn', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-objects': ['warn', { order: 'asc', type: 'natural' }],

      'react-hooks/exhaustive-deps': 'warn',
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      // React
      'react/react-in-jsx-scope': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'warn',
      'unicorn/prefer-global-this': 'off',

      'unicorn/prefer-module': 'off',
      // Unicorn
      'unicorn/prefer-query-selector': 'error',

      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-string-starts-ends-with': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
    settings: {
        'import/resolver': {
          alias: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            map: [
              ['@', './resources/js'],
              ['ziggy-js', './vendor/tightenco/ziggy'],
            ],
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            moduleDirectory: ['node_modules'],
          },
        },
    }
  },
  {
    ignores: ['vendor', 'node_modules', 'public', 'bootstrap/ssr', 'tailwind.config.js'],
  },
  prettier,
];
