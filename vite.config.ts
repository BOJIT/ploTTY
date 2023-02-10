import git from "git-rev-sync";

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
    // Get repo metadata
    process.env.VITE_GIT_HASH = git.short("./", 7);

    return defineConfig({
        plugins: [sveltekit()],
    });
};
