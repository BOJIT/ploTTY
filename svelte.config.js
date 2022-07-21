import adapter from "@sveltejs/adapter-static";
import commonjs from '@rollup/plugin-commonjs'
import preprocess from "svelte-preprocess";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte", ".svelte.md"],
    preprocess: [mdsvex({
            extensions: [".svelte.md"],
        }),
        preprocess()
    ],
    kit: {
        adapter: adapter(),
        prerender: {
            default: true
        },
        vite: {
            plugins: [
                commonjs()
            ]
        }
    },
};

export default config;
