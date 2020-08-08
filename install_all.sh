#!/bin/bash

# We are setting the NODE_env to development only for the installation, in order to install dev and production packages
export NODE_ENV=development

# Install all of the dependencies, including the development and productin
function install_deps() {
    npm install
}

echo "Installing all dependencies for NodeJS & Angular..."
install_deps

# Install the angular deps
pushd angular-src
install_deps
popd
echo "Finished installing dependencies!"
