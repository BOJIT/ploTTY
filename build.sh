#!/bin/bash

BUILD_VERSION="${BUILD:-PROD}"
echo "Build Version: $BUILD_VERSION"

# Clean out build folder
rm -rf dist/*

if [ "$BUILD_VERSION" = "DEV" ]; then
    # Compile templates into single file
    npx combine-html src/html/templates/**/*.html > dist/templates.js
    cp src/html/index.html dist/

    # Compile CSS assets (just copy for now)
    cp -r src/css/. dist/

    # Copy across any static assets
    cp -r assets dist/

    npm run-script dev
else
    # Compile templates into single file
    npx combine-html src/html/templates/**/*.html > dist/templates.js
    cp src/html/index.html dist/

    # Compile CSS assets (just copy for now)
    cp -r src/css/. dist/

    # Copy across any static assets
    cp -r assets dist/

    npm run-script build
fi