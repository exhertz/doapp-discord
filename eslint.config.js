import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['src/**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
            'no-undef': 'error',
            'global-require': 'off',
            'no-path-concat': 'error',
            'prefer-const': 'warn',
            'no-process-env': 'off',
            'no-process-exit': 'warn',
            'callback-return': 'error',
            'handle-callback-err': 'warn',
            'no-sync': 'off',
            'max-len': ['warn', { 'code': 120 }],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'no-tabs': 'error',
            'comma-dangle': ['warn', 'never'],
            'object-curly-spacing': ['warn', 'always'],
            'prefer-destructuring': ['warn'],
            'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
            'camelcase': ['warn'],
            'dot-notation': ['warn'],
            'no-useless-escape': 'off',
            'no-use-before-define': 'off',
            'consistent-return': 'error',
            'eol-last': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
        }
    }
];
