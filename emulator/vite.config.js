import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3039,
		open: true
	},
	build: {
		rolldownOptions: {
			input: {
				main: 'index.html',
				sender: 'sender/index.html',
				receiver: 'receiver/index.html'
			}
		}
	}
});
