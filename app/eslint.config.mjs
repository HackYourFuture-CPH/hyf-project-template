// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const configs = [
    ...compat.extends('next'),
    ...compat.config({
        extends: [
            'next/core-web-vitals',
            'next/typescript',
            'plugin:@next/next/recommended',
            'plugin:react/recommended',
            'plugin:react/jsx-runtime',
            'plugin:react-hooks/recommended',
            'plugin:prettier/recommended',
            'plugin:tailwindcss/recommended',
            'plugin:import/recommended',
            'plugin:jsx-a11y/recommended',
        ],
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
        rules: {
            'react/prop-types': 'warn',
            'prettier/prettier': ['error', { singleQuote: true }],
            'import/no-unresolved': 'off',
        },
    }).map(config => ({
        ...config,
        files: ['**/*.js', '**/*.jsx'],
    })),
];

export default configs;
