import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';


import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


fse.emptyDirSync('dist');
fse.copySync('src', 'dist/src');


const getJsxFilesInDir = (dir, namePrefix = '', nameSuffix = '') =>
{
	const entries = {};
	fs.readdirSync(dir).forEach(file =>
	{
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if(stat.isFile() && file.endsWith('.jsx'))
		{
			const name = path.basename(file, path.extname(file));
			entries[namePrefix + name + nameSuffix] = fullPath;
		}
	});
	return entries;
};


const generateIndex = () =>
{
	const files = getJsxFilesInDir(path.resolve(__dirname, 'dist/src/components'));
	let imports = [];
	for(const name in files)
	{
		imports.push(`export {default as ${name}} from './components/${name}.jsx';`);
	}
	return imports.join('\n') + '\n';
};
fs.writeFileSync(path.resolve(__dirname, 'dist/src/index.js'), generateIndex());


export default {
	input:  {
		...getJsxFilesInDir(path.resolve(__dirname, 'dist/src/components'), '', '/index'),
		'index':'./dist/src/index.js',
	},
	output: {
		dir:           'dist',
		format:        'esm',
		entryFileNames:'[name].js',
		sourcemap:     true,
		exports:       'named',
	},
	plugins:[
		peerDepsExternal(),
		resolve(),
		commonjs(),
		babel({
			runtimeHelpers:true,
			exclude:       'node_modules/**',
			presets:       [
				'@babel/preset-env',
				'@babel/preset-react',
			],
			plugins:       [
				'@babel/plugin-transform-runtime',
			],
		}),
		postcss({
			plugins:[
				autoprefixer(),
				cssnano(),
			],
			inject: true,
		}),
		url(),
		terser(),
	],
};
