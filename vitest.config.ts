/* eslint-disable @typescript-eslint/naming-convention */
import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		include: ['./tests/**/*.test.tsx', './tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'dist/**',
				'tests/**',
				'vitest.config.ts',
			],
		},
	},
});
