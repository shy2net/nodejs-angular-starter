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

### How the API works

The NodeJS comes with two working examples of a working api called `test` and `errorTest`,
which can be viewed under `src/api/controller`.

The way this template is built makes the whole code alot more readable, and easier for testing.
Each route has a function asscoiated in the controller which contains only the parameters that
specific function requires.

On each call to the controller function we provide the params obtained from the request and then we
call the next(data?: any) method in order to let the postResponseMiddleware handle the data and sent it back to the client.

For example, let's look at the test method.

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

The response.getOkayResponse is just a simple method that returns a JSON response:

```typescript
export function getOkayResponse(data?: any) {
  return {
    status: 'ok',
    data: data
  } as ActionResponse<any>;
}
```

ActionResponse objects are objects that specify a response to an action done on the server. You can provide
data which comes with the response.

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

## Sharing code (models, interfaces, etc)

You can use the `shared` directory in order for NodeJS and Angular to share the same code to be used on both sides
without the need of re-writing the models for each.

The already existing models are:

- ActionResponse - a simple response to a user action performed on the api. The server will send this response, and the client will read it.
- UserProfile - a simple user profile model to used for authentication.
