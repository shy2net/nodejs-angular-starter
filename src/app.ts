import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';

import db from './db';
import auth from './auth';
import socialAuth from './social-auth';
import config from './config';
import { join } from 'path';

// App class will encapsulate our web server.
export class App {
  express: express.Application;
  mongoose;

  constructor() {}

  init(port: string | number, ready?: () => void) {
    this.express = express();

    console.log(`Connecting to database...`);

    db.init(() => {
      this.mountPreMiddlewares();
      this.mountRoutes();

      if (!config.DEBUG_MODE) this.mountAngularSSR();
      this.mountPostMiddlewares();

      this.express.listen(port);
      console.log(`Server is now listening on port ${port}...`);
      ready && ready();
    });
  }

  private mountPreMiddlewares(): void {
    // parse application/x-www-form-urlencoded
    this.express.use(bodyParser.urlencoded({ extended: false }));

    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());

    // TODO: Fix according to the environment
    this.express.use(morgan('dev'));

    auth.init(this.express);
    socialAuth.init(this.express);
  }

  private mountPostMiddlewares(): void {}

  private mountAngularSSR(): void {
    const DIST_FOLDER = join(__dirname, 'dist');
    const ngApp = require(join(DIST_FOLDER, 'server'));
    ngApp.init(this.express, DIST_FOLDER);
  }

  private mountRoutes(): void {
    this.express.use('/api', require('./api/routes'));

    // We don't serve angular code on debug mode
    if (config.DEBUG_MODE) {
      return;
    }

    // Point static path to Angular 2 distribution
    this.express.use(express.static(path.join(__dirname, 'dist')));

    // Deliever the Angular 2 distribution
    this.express.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }
}

// The express instance is reachable through the public express property.
export default new App();
