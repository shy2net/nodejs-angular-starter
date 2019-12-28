#!/bin/bash

# Install all of the dependencies, including the development and productin
function install_deps() {
    npm install --only=dev && npm install --only=prod
}

echo "Installing all dependencies for NodeJS & Angular..."
install_deps

# Install the angular deps
pushd angular-src
install_deps
popd
echo "Finished installing dependencies!"
