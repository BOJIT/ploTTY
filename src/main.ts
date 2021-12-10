import './main.scss';
import theme from './ts/theme';
import App from './svelte/App.svelte';

const app = new App({
	target: document.body
});

theme.dark();	// TODO Default to dark theme for now: move to settings extract

export default app;
