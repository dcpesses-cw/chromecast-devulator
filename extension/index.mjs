import * as esbuild from 'esbuild'
import { copy } from 'esbuild-plugin-copy'

await esbuild.build({
	entryPoints: ['src/*'],
	bundle: true,
	outdir: 'dist',
	plugins: [
		copy({
			resolveFrom: 'cwd',
			assets: {
				from: './static/*',
				to: './dist'
			}
		})
	]
})
