#!/bin/bash

# This script compiles typescript and Angular 5 application and puts them into a single NodeJS prject
echo "-- Started build script for Angular & NodeJS --"
echo "Removing out directory..."
rm -rf out

echo "Compiling typescript..."
./node_modules/.bin/tsc -p .

echo "Copying configuration files..."
cp -Rf src/config out/src/config

echo "Installing Angular app dependencies..."
cd angular-src && npm install && npm install --only=dev

echo "Building Angular app for distribution..."
./node_modules/.bin/ng build --aot --prod

echo "Copying angular dist into out directory..."
mkdir ../out/src/dist
cp -Rf dist ../out/src

echo "Removing angular-src dist directory..."
rm -rf dist

# Go back to the current directory
cd ..

echo "-- Finished building Angular & NodeJS, check out directory --"
