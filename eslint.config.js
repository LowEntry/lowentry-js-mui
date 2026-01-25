import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
	// Global ignores
	{
		ignores: [
			'dist/',
			'node_modules/',
			'coverage/',
			'*.tgz',
			'vitest.config.ts',
		],
	},

	// Base recommended configs
	eslint.configs.recommended,
	...tseslint.configs.recommended,

	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
	},

	// TypeScript files configuration
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@stylistic': stylistic,
			'react-hooks': reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'prefer-const': 'error',
			'no-empty': 'error',
			'no-constant-condition': 'error',
			'no-useless-escape': 'error',
			'prefer-rest-params': 'error',
			'no-sparse-arrays': 'error',
			'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unsafe-type-assertion': 'error',
			'@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'as'}],
			'@typescript-eslint/ban-ts-comment': ['error', {'ts-ignore': 'allow-with-description'}],
			'no-console': ['error', {allow: ['warn', 'error']}],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/brace-style': ['error', 'allman'],
			'@stylistic/max-len': ['error', {code: 10000}],
			'@stylistic/arrow-parens': ['error', 'always'],
			'@stylistic/object-curly-spacing': ['error', 'never'],
			'@stylistic/space-before-function-paren': ['error', 'never'],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'default',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
				},
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
					filter: {
						regex: '^(React|ReactDOM|ReactRedux|Redux|RTK|ReduxSaga|ReduxSagaEffects|MuiAvatar|Dayjs|Button|Stack|TextField|ArrowBackIosNewIcon|ArrowForwardIosIcon|MuiDialog|Backdrop|CircularProgress|Menu|CssBaseline|MuiTextField|NumericTextField)$',
						match: false,
					},
				},
				{
					selector: 'variable',
					format: null,
					filter: {
						regex: '^(React|ReactDOM|ReactRedux|Redux|RTK|ReduxSaga|ReduxSagaEffects|MuiAvatar|Dayjs|Button|Stack|TextField|ArrowBackIosNewIcon|ArrowForwardIosIcon|MuiDialog|Backdrop|CircularProgress|Menu|CssBaseline|MuiTextField|NumericTextField)$',
						match: true,
					},
				},
				{
					selector: 'import',
					format: null,
					filter: {
						regex: '^(React|ReactDOM|ReactRedux|Redux|RTK|ReduxSaga|ReduxSagaEffects|MuiAvatar|Dayjs|Button|Stack|TextField|ArrowBackIosNewIcon|ArrowForwardIosIcon|MuiDialog|Backdrop|CircularProgress|Menu|CssBaseline|MuiTextField|NumericTextField)$',
						match: true,
					},
				},
				{
					selector: 'objectLiteralProperty',
					format: null,
					filter: {
						regex: '^\\.less$',
						match: true,
					},
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				{
					selector: 'function',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
				},
				{
					selector: 'parameter',
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'typeProperty',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
				},
			],
		},
	},

	// JSON files configuration
	...jsonc.configs['flat/recommended-with-json'],
	{
		files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
		languageOptions: {
			parser: jsoncParser,
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'double'],
			'@stylistic/object-curly-spacing': ['error', 'never'],
			'jsonc/no-comments': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/consistent-type-assertions': 'off',
		},
	},

	// Test files configuration - relaxed rules
	{
		files: ['tests/**/*.ts', 'tests/**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: null,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@typescript-eslint/consistent-type-assertions': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'no-sparse-arrays': 'off',
			'no-console': 'off',
		},
	},
);
