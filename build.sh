#!/bin/bash

echo "Checking for missing dependencies before build..."

# Check if node_modules exists, if not throw an error
if [ ! -d "./node_modules" ] || [ ! -d "./angular-src/node_modules" ]; then
    echo "node_modules are missing! running install script..."
    npm run install:all
    echo "Installed all missing dependencies! starting installation..."
else
    echo "All dependencies are installed! Ready to run build!"
fi

# This script compiles typescript and Angular 7 application and puts them into a single NodeJS project
ENV=${NODE_ENV:-development}
echo -e "\n-- Started build script for Angular & NodeJS (environment $ENV) --"
echo "Removing dist directory..."
rm -rf dist

echo "Compiling typescript..."
./node_modules/.bin/tsc -p .

echo "Copying configuration files..."
cp -Rf src/config dist/src/config

echo "Starting to configure Angular app..."
pushd angular-src

echo "Building Angular app for $ENV..."
./node_modules/.bin/ng build --aot --prod --configuration $ENV

# TODO: Remove this 'if' statment until the 'fi' if you don't want SSR at all
if [ $ENV == "production" ]; then
    echo "Building Angular app for SSR..."
    ./node_modules/.bin/ng run angular-src:server:production && ./node_modules/.bin/webpack --config webpack.server.config.js --progress --colors
else
    echo "Skipping build for SSR as environment is NOT production"
fi

echo "Copying angular dist into dist directory..."
mkdir ../dist/src/dist
cp -Rf dist ../dist/src

echo "Removing angular-src dist directory..."
rm -rf dist

# Go back to the current directory
popd

echo "-- Finished building Angular & NodeJS, check dist directory --"
