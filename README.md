- [Introduction](#introduction)
- [Starting with this template](#starting-with-this-template)
- [Template architecture](#template-architecture)
  - [Angular 7](#angular-7)
    - [Angular services & providers](#angular-services--providers)
    - [Angular components](#angular-components)
    - [Angular Universal (Server-Side-Rendering)](#angular-universal-server-side-rendering)
  - [NodeJS](#nodejs)
    - [How the API works](#how-the-api-works)
      - [Working with API params](#working-with-api-params)
      - [API middlewares](#api-middlewares)
    - [Database](#database)
    - [Authentication and roles](#authentication-and-roles)
      - [Logging with Winston](#logging-with-winston)
      - [Social Authentication](#social-authentication)
    - [Environment configurations](#environment-configurations)
    - [Unit Testing](#unit-testing)
  - [Sharing code (models, interfaces, etc)](#sharing-code-models-interfaces-etc)
- [Running on production](#running-on-production)
  - [Running Angular and NodeJS on the same server](#running-angular-and-nodejs-on-the-same-server)
    - [The build script (build.sh)](#the-build-script-buildsh)
  - [Seperating client and server](#seperating-client-and-server)
    - [Server as standalone](#server-as-standalone)
    - [Angular as standalone](#angular-as-standalone)

# Introduction

This starter template comes with NodeJS (typescript) and Angular 7. It shares models between Angular
and NodeJS. Both of the NodeJS and and Angular 7 can run on the same webserver as the NodeJS exposes all of the
default routes to Angular and all of the known routes to the api.

Technologies used in this template:

- Angular 7 (with SSR)
- NodeJS typescript
- Mongoose (with basic user model)
- Bootstrap v4 and SCSS by default
- JWT and token authentication built-in (including user roles)
- Winston logging
- Social Authentication (Google and Facebook)

# Starting with this template

To work with this template **locally (debug mode)**, follow these commands:

    npm install # Install NodeJS dependencies and angular
    npm run node # Run the NodeJS on debug mode
    npm run angular # Run Angular

We don't run the `npm start` command as it is reserved only for the compiled code to run on a production server.

In order to compile and build this template for your **production server** run the following:

    npm install
    npm run build # Run the build.sh script to compile and NodeJS and Angular for production
    npm start

These list of commands will install, compile and run the output NodeJS.

# Template architecture

The template comes with a ready to go server and client integration, authentication and basic styling.

## Angular 7

Angular 7 comes with the following features:

- Bootstrap v4 with header and sticky footer.
- Built in SSR bundled with the api server.
- Built in toasty (ngx-toastr) which automatically pops up on HTTP errors obtained from the server API.
- Built in ngx-loading-bar (Youtube styled) when moving between routes.
- Built in auth-guard and authentication, saved on session cookie.
- Built in social authentication (Google and Facebook).

The code of Angular 7 is stored under the `angular-src` directory.

### Angular services & providers

This template comes with multiple services and proviers which can be used accross the template.

- `ApiService` - This service wraps the access to the server api. It should contain a 'mirror' of the functions that the server has.
- `AuthService` - This service exposes all of the authentication mechanisem and handles all of the login, including login to the api, obtaining the token and saving the token to a cookie for next refresh.
- `AuthGuardService` - An auth guard which used the `AuthService` to guard routes. It also comes with role checking by specifing the `typescript { roles: ['roleName'] }` data for your route.
- `AppHttpInterceptor` - This provider acts as an interceptor for all of the http requests ongoing. It adds the authentication token if provided by the `AuthService` to each request. Then it passes the request to the `RequestsService` to handle.
- `RequestsService` - This service handles all of the requests passing through using the `AppHttpInterceptor`. It shows an error toast if an error had occured in one of the requests.
- `AppService` - Holds information about the current user and app related data.
- `SocialLoginService` - This service is responsible for the whole social authentication (Google and Facebook), it uses `angularx-social-login` module to do so. This service can be found under `social-login` module which initializes all of the providers (which are the 3rd party social sites).

### Angular components

- `AppComponent` - The app component is the bootstrap component of this template. It contain the HTML of the app (such the header, router-oulet and footer). It contains logic to listen to routing changes and showing or hiding the slim loading bar (Youtube styled routing progress bar).

- `HeaderComponent` - The header part of the template. It shows a simple header based on bootstrap which is suitable for mobile as well.
- `FooterComponent` - A simple sticky footer that always appear at the bottom of the page.
- `LoginComponent` - A simple login with username and password which authenticates against the server.
- `UserPageComponent` - A simple page that shows information about the currently logged in user with option of logging out.
- `SocialLoginButton` - A simple container of social login buttons which also performs the social authentication itself.

### Angular Universal (Server-Side-Rendering)

By default this template comes ready with Angular Universal which allows search engines to crawl your website better.
It does this on the NodeJS side after running the `npm run build` command which bundles the angular code and create an angular universal express ready file called `out/src/dist/server.js` which our NodeJS simply imports and initializes in the `src/app.ts` file.

in the `src/app.ts` you have these two methods:

```typescript
  /**
   * Mounts angular using Server-Side-Rendering (Recommended for SEO)
   */
  private mountAngularSSR(): void {
    const DIST_FOLDER = join(__dirname, 'dist');
    const ngApp = require(join(DIST_FOLDER, 'server'));
    ngApp.init(this.express, DIST_FOLDER);
  }

  /**
   * Mounts angular as is with no SSR.
   */
  private mountAngular(): void {
    // Point static path to Angular 2 distribution
    this.express.use(express.static(path.join(__dirname, 'dist/browser')));

    // Deliever the Angular 2 distribution
    this.express.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
    });
  }
```

By default the mountAngular is called in the init method of `src/app.ts`, simply change it into `mountAngularSSR` in order to enable
SSR, but be careful as SSR requires special treatments in your code on certain situations.

## NodeJS

Comes with built in typescript support and compilation.

It comes with the following features:

- Authentication (including middlewares and token generation)
- Angular routes support (redirect to index.html of compiled Angular code), this means you can run you Angular app and API on the same container!
- Configuration according to environment (using config npm package).
- Logging using Winston.
- Social Authentication, which basically gets an access token from the client that logged into a service and then creates a user associated with it.
- Unit testing using Mocha and Chai.

The code of NodeJS is stored under the `src` directory.
Output directory of the compiled typescript will be available in the `out` directory.

### How the API works

NodeJS comes with three working examples of a working api called `test`, `errorTest` and `saySomething`,
which can be viewed under `src/api/api.controller`.

The way this template is built makes the whole code alot more readable, and easier for testing.
Each route has a function asscoiated in the controller which contains only the parameters that
specific function requires.

On each call to the controller function we provide the params obtained from the request and then we
call the `next(data?: any)` method in order to let the postResponseMiddleware handle the data and send it back to the client.

Let's look at the test example.

api.routes.ts:

```typescript
router.get(
  '/test',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.test());
  }
);
```

api.controller.ts:

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

api.controller.ts:

```typescript
  saySomething(whatToSay: string) {
    return Promise.resolve(responses.getOkayResponse(whatToSay));
  }
```

api.routes.ts:

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

#### API middlewares

The api comes with some prepacked middlewares which can be found in the `src/api/middlewares.ts` file:

- `unhandledErrorMiddleware` - Manages runtime errors the occured within a controller (async error occur in a promise are handled in the postErrorMiddleware).
- `postResponseMiddleware` -This middleware handles data obtained from responses that return either and error or a promise with data. If none of the above return, it will throw an exception.
- `postErrorMiddleware` - This middleware will handle the errors obtained from the postResponseMiddleware.

### Database

This template uses mongoose as the backend server to store users. It has only one model called UserProfileModel which you can find in the `src/models` directory.
You can view the database code at the `src/db.ts` file, which basically is responible with the communication to the database.

In order to configure the database connection string, please review the `Environment configurations` part of this readme.

### Authentication and roles

This template comes prepacked with JWT authentication and associated middlewares to authenticate users.
in the `src/auth.ts` file you will be able to see how the authentication is implemented.

Basically, when a login occurs, the user is being authenticated against a hased password using bcrypt, if the passwords match, a token is being generated containing the user data within.

When accessing guarded routes (using the authenticationMiddleware in the `auth.ts` file), the token will be decrypted and checked to see if it's valid. If so, the request will pass and a `req.user` property will be filled with currently logged on user.

For example, let's take a look at a guarded route, such as the `/api/profile`.

In the `api.routes.ts` you can see the following code:

```typescript
router.get(
  '/profile',
  auth.authenticationMiddleware,
  (req: AppRequest, res: AppResponse, next: (data) => void) => {
    next(controller.getProfile(req.user));
  }
);
```

The `auth.authenticationMiddleware` will simply check the token and if it's valid, will return the user associated with it in the `req.user` property of the request.
Which we then deliever to the `api.controller.ts`:

```typescript
  getProfile(user: UserProfile): Promise<UserProfile> {
    return Promise.resolve(user);
  }
```

Simple isn't it? The token is being delievered in the Authorization header in the format of `Authorization: Bearer ${Token}`.

What about user roles? Each user profile has an array of `roles` which holds strings which contains the roles relevant for the user. For example, if you add the role `admin` to your user you should be able to access the `/api/admin_test` endpoint as it is guarded using the `getHasRolesMiddleware` method.

Let's see how it is implemented.

`src/api/routes`:

```typescript
// An example of a route which will only be accessible for users with the 'admin' role
router.get(
  '/admin_test',
  auth.authenticationMiddleware,
  auth.getHasRolesMiddlware('admin'),
  (req: AppRequest, res: AppResponse, next: (data) => void) => {
    next(controller.test());
  }
);
```

#### Logging with Winston

This template comes ready with [winston logger](https://www.npmjs.com/package/winston). By default it will save all of the error logs into the `logs` directory.
In order to edit the logging configurations you must open the `src/logger.ts` file and edit the default export:

```typescript
export default winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new winston.transports.File({ filename: `${config.LOGS_PATH}/error.log`, level: 'error' })
  ]
});
```

**You can use getExpressLoggingMiddleware in your `app.ts` file to generate log for each request being made.**
In order for this middleware to work, simply go to the `src/app.ts`  and edit the `mountRoutes` method with the already commented example:

```typescript
private mountRoutes(): void {
  // This will import the api routes and log each request being made
  this.express.use('/api', getExpressLoggingMiddleware(), require('./api/api.routes'));
}
```

#### Social Authentication

The procedure of social authentication takes place in the client side, after the client obtains an access token from the 3rd party (Google, Facebook), that access token
will be delieverd to the `social-login/provider` (replace provider with the 3rd party name), which will create a user from the token provided by accessing that specific
3rd party social network user profile information and map the user data into a data applicable for our website.

The authentication is implemented via the `passport` npm package with packages like `passport-facebook-token` and `passport-google-token`.
If A user with the provided email exists, it is returned with a new access token which is only relevant for our app (just like normal authentication).

Take a look at the `src/social-auth` implementation to see how the access token is being used.

### Environment configurations

This template is using the npm `config` package load configurations. You can read more about it here:
https://www.npmjs.com/package/config

All of the configurations are located at the `src/config` directory. The way it loads the configuration is by first loading the `default.json` files and then load the associated environment configuration (by default `development.json`).

In order to change the environment you must specify the `NODE_ENV` environment variable.

For example, if you run on production specify:
`NODE_ENV = production`.


### Unit Testing

This template comes with Mocha and Chai integrated. It comes with some simple unit testing which can be found under `src/api/api.controller.spec.ts`. This file holds 3 simple tests which checks that the API works correctly.

In order to run the tests simply run the command: `npm test`.

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

**Take into consideration that it will not work on debug mode.**

When building your image for production it should contain the following commands:

    npm install
    npm run build # Call the build.sh script to start the build

And to run this code simple:

    npm start

### The build script (build.sh)

The build script called `build.sh` is a shell script provided with the template which by default will compile the typescript
NodeJS server side and Angular into one. This means when you run the server after the build you will have both on the same
node container.

Make sure to include the `NODE_ENV` environment variable (or else the build will be set to `development` environment) before calling this
script. The build will compile and copy all of the required configurations for the specified environment, and will generate the Angular
code according to that environment.

By default, when building to production, Server Side Rendering (SSR) is set to build as well:

```bash
# TODO: Remove this 'if' statment until the 'fi' if you don't want SSR at all
if [ $ENV == "production" ]
then
    echo "Building Angular app for SSR..."
    ./node_modules/.bin/ng run angular-src:server:production && ./node_modules/.bin/webpack --config webpack.server.config.js --progress --colors
else
    echo "Skipping build for SSR as environment is NOT production"
fi
```

You can remove this set of code if you don't want it to take place at all.


## Seperating client and server

### Server as standalone

In order to run the server as standalone, simply compile it:

    npm run build:node

The output will be projected into the `out` directory.

### Angular as standalone

In order to run angular as a standalone, simply compile it:

    npm run build:angular

The output will be projected into the `angular-src/dist` directory.
