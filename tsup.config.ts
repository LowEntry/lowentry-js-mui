import {defineConfig} from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	sourcemap: true,
	clean: true,
	minify: false,
	target: 'esnext',
	outDir: 'dist',
	external: [
		'react',
		'react-dom',
		'@mui/material',
		'@mui/icons-material',
		'@emotion/react',
		'@emotion/styled',
		'@lowentry/utils',
		'@lowentry/react-redux',
	],
	esbuildOptions(options) 
	{
		// Treat .less imports as empty (CSS-in-JS or consumer handles styling)
		options.loader = {
			...options.loader,
			'.less': 'empty',
		};
	},
});
