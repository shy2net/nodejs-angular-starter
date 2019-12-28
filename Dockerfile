FROM node:12.14.0-alpine3.11

# Change the working directory for our app
WORKDIR /usr/src/app

# Add bash support for alpine
RUN apk add --no-cache bash

# Copy all of the required files
COPY . .

# Change the shell into bash
SHELL ["/bin/bash", "-c"]

# Give required permissions to files
RUN chmod +x ./install_all.sh && chmod +x ./build.sh

# Install deps, compile and build NodeJS & Angular
RUN npm run build

EXPOSE 3000
CMD npm start