// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    {
        ignores: ['**/out/**', '**/dist/**', '**/*.d.ts', '**/node_modules/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            'curly': 'error',
            'eqeqeq': 'error',
            'no-throw-literal': 'warn',
            'semi': 'error',
            'indent': ['error', 4],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    'vars': 'all',
                    'varsIgnorePattern': '^_',
                    'args': 'after-used',
                    'argsIgnorePattern': '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off'
        },
    }
);
