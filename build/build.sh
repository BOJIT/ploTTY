#!/bin/bash

# Called directly by GitHub actions -
# when building with docker-compose, call through NPM build/dev

# should do the following:
# - build Typescript into single JS file (main.js)
# - Bundle NPM js packages with browserify (bundle.js)
# - Compile all HTML into a single file with templates
# - Compile all CSS into single stylesheet
# - Produce 3 files: index.html, bundle.js, style.css

echo 'Hello World' $1