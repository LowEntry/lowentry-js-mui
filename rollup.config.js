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


const generateEntries = (dir) =>
{
	const entries = [];
	fs.readdirSync(dir).forEach(file =>
	{
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if(stat.isDirectory())
		{
			const subEntries = generateEntries(fullPath);
			entries.push(...subEntries);
		}
		else if(file.endsWith('.jsx'))
		{
			entries.push(fullPath);
		}
	});
	return entries;
};


export default {
	input:  [
		...generateEntries(path.resolve(__dirname, 'src/widgets')),
	],
	output: {
		dir:           'dist',
		format:        'es',
		entryFileNames:'external/[name].js',
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
