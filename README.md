# Introduction

This starter template comes with NodeJS (typescript) and Angular 6. It shares models between Angular
and NodeJS. Both of the NodeJS and and Angular 6 can run on the same webserver as the NodeJS exposes all of the
default routes to Angular and all of the known routes to the api.

Technologies used in this template:

- Angular 6
- NodeJS typescript
- Bootstrap v4

# About this template

This template comes with a ready to go server and client integration, authentication and basic styling.

## Angular 6

Angular 6 comes with the following features:

- Bootstrap v4 with header and sticky footer.
- Built in toasty which automatically pops up on HTTP errors obtained from the server API.
- Built in ng2-slim-loading bar (Youtube styled) when moving between routes.
- Built in auth-guard and authentication, saved on session cookie.

The code of Angular 6 is stored under the `angular-src` directory.

## NodeJS

Comes with built in typescript support and compilation. It comes with the support of running NodeJS
and compiled and production ready Angular 6.

It comes with the following features:

- Authentication (including middlewares and token generation)
- Angular 6 routes support (redirect to index.html of compiled Angular code)
- Configuration according to environment (using config npm package).

The code of NodeJS is stored under the `src` directory.
The output directory of the compiled typescript will be available in the `out` directory.

# Starting with this template

In order to work with this template, follow these commands:

    npm install # Install NodeJS dependencies and angular
    npm run debug # Run the NodeJS at debug mode
    npm run angular # Run Angular 6

We don't run the `npm start` command as it is reserved only for the compiled code to run on a production server.

In order to compile and build this template for your server run the following:

    npm install
    npm run build
    npm start

These list of commands will install, compile and run the output NodeJS.
