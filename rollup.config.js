import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/injection.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'injection',
			file: 'public/build/injection.js',
		},
		plugins: [
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
				},
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'injection.css' }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),

			commonjs(),
			json(),
			// instead of npm run dev), minify
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/popup.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'popup',
			file: 'public/build/popup.js',
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
				},
			}),
			css({ output: 'popup.css' }),

			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),
			json(),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/options.js',
		output: {
			sourcemap: false,
			format: 'iife',
			name: 'options',
			file: 'public/build/options.js',
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
				},
			}),
			css({ output: 'options.css' }),

			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),
			json(),
			production && terser(),
		],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/background.js',
		output: {
			sourcemap: false,
			format: 'iife',
			file: 'public/build/background.js',
		},
		plugins: [resolve(), commonjs(), json(), production && terser()],
		watch: {
			clearScreen: false,
		},
	},
];
