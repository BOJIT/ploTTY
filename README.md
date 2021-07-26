# ploTTY
Browser Based Serial Monitor/Plotter that doesn't suck!

# Build Docker Image and Production
`docker compose up --build`

# Build as Development/live server
`docker compose run app npm run start`

# Build as Production
`docker compose run app npm run build`

if this throws the error: `Error response from daemon: invalid mount config for type "bind": bind source path does not exist:`, run `mkdir dist` once.
