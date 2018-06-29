- [Introduction](#introduction)
- [Starting with this template](#starting-with-this-template)
- [Template architecture](#template-architecture)
  - [Angular 6](#angular-6)
  - [NodeJS](#nodejs)
    - [How the API works](#how-the-api-works)
      - [Working with API params](#working-with-api-params)
    - [Environment configurations](#environment-configurations)
  - [Sharing code (models, interfaces, etc)](#sharing-code-models-interfaces-etc)
- [Running on production](#running-on-production)
  - [Running Angular and NodeJS on the same server](#running-angular-and-nodejs-on-the-same-server)
  - [Seperating client and server](#seperating-client-and-server)
    - [Server as standalone](#server-as-standalone)
    - [Angular as standalone](#angular-as-standalone)

# Introduction

This starter template comes with NodeJS (typescript) and Angular 6. It shares models between Angular
and NodeJS. Both of the NodeJS and and Angular 6 can run on the same webserver as the NodeJS exposes all of the
default routes to Angular and all of the known routes to the api.

Technologies used in this template:

- Angular 6
- NodeJS typescript
- Bootstrap v4

# Starting with this template

In order to work with this template, follow these commands:

    npm install # Install NodeJS dependencies and angular
    npm run debug # Run the NodeJS on debug mode
    npm run angular # Run Angular 6

We don't run the `npm start` command as it is reserved only for the compiled code to run on a production server.

In order to compile and build this template for your server run the following:

    npm install
    npm run build # Run the build.sh script to compile and NodeJS and Angular for production
    npm start

These list of commands will install, compile and run the output NodeJS.

# Template architecture

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

### How the API works

The NodeJS comes with three working examples of a working api called `test`, `errorTest` and `saySomething`,
which can be viewed under `src/api/controller`.

The way this template is built makes the whole code alot more readable, and easier for testing.
Each route has a function asscoiated in the controller which contains only the parameters that
specific function requires.

On each call to the controller function we provide the params obtained from the request and then we
call the `next(data?: any)` method in order to let the postResponseMiddleware handle the data and send it back to the client.

For example, let's look at the test eaxmple.

routes.ts:

```typescript
router.get(
  '/test',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.test());
  }
);
```

controller.ts:

```typescript
  test() {
    return Promise.resolve(responses.getOkayResponse());
  }
```

The `responses.getOkayResponse(data?: any)` is just a simple method that returns a JSON response:

```typescript
export function getOkayResponse(data?: any) {
  return {
    status: 'ok',
    data: data
  } as ActionResponse<any>;
}
```

ActionResponse objects are objects that specify a response to an action done on the server. You can provide
data which comes with the response. If the status of the ActionResponse is error, it will appear as toast
by default in the client.

You probably ask yourself, how does the data sent back to the client? well it is done using the call for `next(data?: any)`.
This call will send the back to the postResponseMiddleware:

```typescript
export function postResponseMiddleware(
  data: any,
  req: AppRequest,
  res: AppResponse,
  next: (error) => any
) {
  if (data instanceof Error) {
    return next(data);
  } else if (data instanceof Promise) {
    return apiHelper.handlePromiseResponse(data, req, res, next);
  } else {
    throw 'Data is not recognized, please make sure the controller you use returns a promise or an error';
  }
}
```

And the `apiHelper.handlePromiseResponse` method will just do the following:

```typescript
export function handlePromiseResponse(
  promise: Promise<any>,
  req: Request,
  res: Response,
  next?: (error: any) => void
) {
  promise
    .then(data => {
      res.json(data);
    })
    .catch((error: any) => {
      next && next(error instanceof Error ? error : new Error(error));
    });
}
```

#### Working with API params

Let's review the working example of saySomething:

controller.ts:

```typescript
  saySomething(whatToSay: string) {
    return Promise.resolve(responses.getOkayResponse(whatToSay));
  }
```

routes.ts:

```typescript
router.get(
  '/say-something',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Ready the url param say
    const whatToSay = req.param('what') as string;

    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.saySomething(whatToSay));
  }
);
```

Now simple open up your browser to the api url with a 'what' param:

> http://localhost:3000/api/say-something?what=Hello

And you will get this output:

```json
{
  "status": "ok",
  "data": "Hello"
}
```

### Environment configurations

This template is using the npm `config` package load configurations. You can read more about it here:
https://www.npmjs.com/package/config

All of the configurations are located at the `src/config` directory. The way it loads the configuration is by first loading the `default.json` files and then load the associated environment configuration (by default `development.json`).

In order to change the environment you must specify the `NODE_ENV` environment variable.

For example, if you run on production specify:
`NODE_ENV = production`.

## Sharing code (models, interfaces, etc)

You can use the `shared` directory in order for NodeJS and Angular to share the same code to be used on both sides
without the need of re-writing the models for each.

The already existing models are:

- ActionResponse - a simple response to a user action performed on the api. The server will send this response, and the client will read it.
- UserProfile - a simple user profile model to used for authentication.

# Running on production

In order to run this code on production, you must first compile it.
There a few things to take into consideration:

## Running Angular and NodeJS on the same server

This template comes with Angular and NodeJS bundled together and can
be up and running together on the same NodeJS server. This takes place using the `build.sh` bash script
that knows how to compile them together and bundle them.

How does it work? Well it simply compiles each one seperatly and then copies the angular-src output dist directory
into the NodeJS src directory and delievers them in the `src/app.ts` like this:

```typescript
// Point static path to Angular 2 distribution
this.express.use(express.static(path.join(__dirname, 'dist')));

// Deliever the Angular 2 distribution
this.express.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
```

Take into consideration that it will only work on debug mode.

## Seperating client and server

### Server as standalone

In order to run the server as standalone, simply compile it:
npm run build:node

The output will be projected into the `out` directory.

### Angular as standalone

In order to run angular as a standalone, simple compiled it:
npm run build:angular

The output will be projected into the `angular-src/dist` directory.
