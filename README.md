# ploTTY
## Browser Based Serial Monitor/Plotter that doesn't suck!
## [https://plotty.bojit.dev/]

# Build Docker Image and Production
`docker compose up --build`

# Build as Development/live server
`docker compose -f docker-compose.debug.yml up --build`

if this throws the error: `Error response from daemon: invalid mount config for type "bind": bind source path does not exist:`, run `mkdir dist` once.
