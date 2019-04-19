#!/bin/bash

echo "Copying configuration files..."
rm -rf ./out/src/config
mkdir ./out/src/config
cp -Rf ./src/config/* ./out/src/config
echo "Configuration files succesfully copied!"