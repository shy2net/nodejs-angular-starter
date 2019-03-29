#!/bin/bash

# This script compiles typescript and Angular 7 application and puts them into a single NodeJS project
ENV=${NODE_ENV:-development}
echo "-- Started build script for Angular & NodeJS (environment $ENV) --"
echo "Removing out directory..."
rm -rf out

echo "Compiling typescript..."
./node_modules/.bin/tsc -p .

echo "Copying configuration files..."
cp -Rf src/config out/src/config

echo "Installing Angular app dependencies..."
cd angular-src && npm install --only=dev

echo "Building Angular app for $ENV..."
./node_modules/.bin/ng build --aot --prod --configuration $ENV


# TODO: Remove this 'if' statment until the 'fi' if you don't want SSR at all
if [ $ENV == "production" ]
then
    echo "Building Angular app for SSR..."
    ./node_modules/.bin/ng run angular-src:server:production && ./node_modules/.bin/webpack --config webpack.server.config.js --progress --colors
else
    echo "Skipping build for SSR as environment is NOT production"
fi

echo "Copying angular dist into out directory..."
mkdir ../out/src/dist
cp -Rf dist ../out/src

echo "Removing angular-src dist directory..."
rm -rf dist

# Go back to the current directory
cd ..

echo "-- Finished building Angular & NodeJS, check out directory --"
