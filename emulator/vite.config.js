import { defineConfig } from 'vite';

export default defineConfig({
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
