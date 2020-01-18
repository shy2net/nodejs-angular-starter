# Create global variables to be used later
ARG workdir=/app
ARG NODE_ENV=development

FROM node:12.14.0-alpine3.11 as base

# Configure environment variables
ENV NODE_ENV ${NODE_ENV}

FROM base as build

ARG workdir
ARG NODE_ENV

# Compile code /compile directory
WORKDIR /compile

# Copy all of the required files
COPY . .

# Add bash support to alpine
# Read this guide for more info: https://www.cyberciti.biz/faq/alpine-linux-install-bash-using-apk-command/
RUN echo "NODE_ENV for build was set to: ${NODE_ENV}, starting build..." \
    && apk add --no-cache bash \
    # Build cymptom-web and create a distribution
    && chmod +x ./install_all.sh && chmod +x ./build.sh && npm run build \
    # Copy the files required to run to the workdir
    && mkdir ${workdir} && cp -Rf ./dist ${workdir} \
    # Before we copy node modules, remove all dev modules
    && npm prune --production \
    && cd ./angular-src && npm prune --production && cd ../ \
    # Copy required node modules
    && cp -Rf ./node_modules ${workdir} \
    && cp -Rf ./angular-src/node_modules/* ${workdir}/node_modules/ \
    && cp ./package.json ${workdir} \
    # Remove source files, and delete bash
    && rm -Rf /compile \
    && apk del bash --purge


# Create clean image for distribution
FROM base

# Change the work dir to the directory we are actually running the code
WORKDIR /app

# Copy distribution files
COPY --from=build /app .

# Expose the port required for cymptom-web (http and https)
EXPOSE 3000 443

# Start the built distribution
CMD [ "npm", "start" ]