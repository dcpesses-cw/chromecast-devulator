import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				sender: resolve(__dirname, 'sender/index.html'),
				receiver: resolve(__dirname, 'receiver/index.html')
			}
		}
	}
});
