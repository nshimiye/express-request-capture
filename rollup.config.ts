import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';

import babel from 'rollup-plugin-babel';
const pkg = require('./package.json');

const libraryName = 'express-request-capture';
/**
 * This package can only be used in Nodejs env
 * It cant be used it in a browser env
 */
export default [
	{
		input: `compiled/v2/index.js`,
		output: { file: pkg.module, format: 'es' },
		sourcemap: true,
		// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
		external: [],
		watch: {
			include: 'compiled/**',
		},
		plugins: [
			// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
			commonjs(),
			// Allow node_modules resolution, so you can use 'external' to control
			// which external modules to include in the bundle
			// https://github.com/rollup/rollup-plugin-node-resolve#usage
			resolve(),
			// Resolve source maps to the original source
			sourceMaps(),
		],
	},
	{
		input: `compiled/v2/index.js`,
		output: { file: pkg.main, name: camelCase(libraryName), format: 'cjs' },
		sourcemap: true,
		external: [],
		watch: {
			include: 'compiled/**',
		},
		plugins: [
			commonjs(),
			resolve(),
			babel({
				exclude: 'node_modules/**',
			}),
			sourceMaps(),
		],
	},
];
