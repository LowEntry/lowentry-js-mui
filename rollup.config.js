import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import cssnano from 'cssnano';


import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getFilesInDir = (dir, namePrefix = '', nameSuffix = '') =>
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
	const files = getFilesInDir(path.resolve(__dirname, 'src/widgets'));
	let imports = [];
	for(const name in files)
	{
		imports.push(`export { default as ${name} } from './widgets/${name}';`);
	}
	return imports.join('\n') + '\n';
};
fs.writeFileSync(path.resolve(__dirname, 'src/index.js'), generateIndex());


export default {
	input:  {
		...getFilesInDir(path.resolve(__dirname, 'src/widgets'), '', '/index'),
		'index':'./src/index.js',
	},
	output: {
		dir:           'dist',
		format:        'es',
		entryFileNames:'[name].js',
	},
	plugins:[
		del({targets:'dist'}),
		peerDepsExternal(),
		resolve({
			extensions:['.js', '.jsx'],
		}),
		commonjs(),
		babel({
			exclude:'node_modules/**',
			presets:['@babel/preset-env', '@babel/preset-react'],
		}),
		postcss({
			plugins:[
				cssnano(),
			],
			inject: true,
		}),
		terser(),
	],
};
