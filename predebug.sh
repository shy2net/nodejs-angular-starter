#!/bin/bash

echo "Building typescript..."

rm -rf ./dist
./node_modules/.bin/tsc -p ./tsconfig.prod.json

echo "Copying configuration files..."
rm -rf ./dist/src/config
mkdir ./dist/src/config
cp -Rf ./src/config/* ./dist/src/config
echo "Configuration files succesfully copied!"
echo "Ready for debugging!"
