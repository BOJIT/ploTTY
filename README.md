# ploTTY
## Browser Based Serial Monitor/Plotter that doesn't suck!

This app is has no backend, so can be self-hosted or accessed [here](https://plotty.bojit.org/).

## Development and Contributing

Built using `Node V16.13.0`

### Run in Development Mode
`npm run dev`

### Build Production Bundle
`npm run build`

### Custom Components

Icon index available [here](https://github.com/flowhub/the-graph/blob/master/the-graph/font-awesome-unicode-map.js):

### Local Development

clone `BOJIT/ploTTY` and `BOJIT/the-graph`.

#### in `BOJIT/the-graph`:

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
npm link the-graph react react-dom
```