# ploTTY
## Browser Based Serial Monitor/Plotter that doesn't suck!

This app is has no backend, so can be self-hosted or accessed [here](https://plotty.bojit.org/).

The insider channel (unstable) is located [here](https://development.plotty.pages.dev/)

## Development and Contributing

Built using `Node v16.16.0` and `NPM v8.11.0`.

### Run in Development Mode
`npm run dev`

### Build Production Bundle
`npm run build`

### Custom Components

Icon index available [here](https://github.com/flowhub/the-graph/blob/master/the-graph/font-awesome-unicode-map.js):

### Local Development

The application is built with [SvelteKit](https://kit.svelte.dev)!

---

APPENDIX: TODO clean up!

#### in `BOJIT/noflo-svelte`:

```bash
npm install
npm link
cd node_modules/react
npm link
cd ../react-dom
npm link
```

#### in `BOJIT/ploTTY`:

```bash
npm install
npm link noflo-svelte react react-dom
```
