#!/bin/bash

BUILD_VERSION="${BUILD:-PROD}"

echo "Build Version: $BUILD_VERSION"

rm -rf dist/* # Clean out dist folder

if [ "$BUILD_VERSION" = "DEV" ]; then
    ls -l src
    # rm
else
    # Compile templates into single file
    npx combine-html src/html/templates/**/*.html > dist/templates.js
    cp src/html/index.html dist/

    # Compile CSS assets (just copy for now)
    cp -r src/css/. dist/

    # Copy across any static assets
    cp -r assets dist/

    # Compile all typescript to a single file
    npx tsc

    # Bundle JS dependencies into single JS file
    npx browserify dist/temp.js > dist/scripts.js
    rm dist/temp.js
fi