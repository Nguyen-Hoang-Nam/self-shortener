import svelte from 'rollup-plugin-svelte'; // Compile Svelte components with Rollup
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6
import resolve from '@rollup/plugin-node-resolve'; // For using third party modules in node_modules
import livereload from 'rollup-plugin-livereload'; // Live reload
import { terser } from 'rollup-plugin-terser'; // Minify generated ES bundle

import sveltePreprocess from 'svelte-preprocess'; // Transform preprocess
import typescript from 'rollup-plugin-typescript2'; // Plugin for typescript with compiler errors

import css from 'rollup-plugin-css-only'; // Rollup plugin that bundles imported css
import svg from "rollup-plugin-svelte-svg";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [

	// Load Web Worker file into build folder
	{
		input: 'src/hash/hash.worker.js',
		output: [
			{
				format: 'iife',
				file: 'public/build/hash.worker.js'
			}
		],
		plugins: [
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			production && terser(),
		],
		watch: {
			clearScreen: false
		}
	},

	// Load Svelte into build and link to Web Woker  
	{
		input: 'src/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/bundle.js'
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess(),
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production
				}
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),
			svg(),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSourceMap: !production
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
		],
		watch: {
			clearScreen: false
		}
	}
]
