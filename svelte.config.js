import adapter from '@sveltejs/adapter-static';
import { mdsvex } from "mdsvex";
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte", ".svelte.md"],
    preprocess: [
        mdsvex({
            extensions: [".svelte.md"],
        }),
        vitePreprocess(),
    ],
    kit: {
        adapter: adapter()
    }
};

export default config;
