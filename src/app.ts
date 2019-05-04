import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';

import auth from './auth';
import config from './config';
import db from './db';
import logger, { getExpressLoggingMiddleware } from './logger';
import socialAuth from './social-auth';

// App class will encapsulate our web server.
export class App {
  express: express.Application;
  mongoose;

  constructor() {}

  init(port: string | number, ready?: () => void) {
    this.express = express();

    logger.info(`Connecting to database...`);

    db.init(() => {
      this.mountPreMiddlewares();
      this.mountRoutes();

      // If we are not on debug mode, run angular
      if (!config.DEBUG_MODE) this.mountAngular();

      this.mountPostMiddlewares();

      this.express.listen(port);
      logger.info(`Server is now listening on port ${port}...`);
      ready && ready();
    });
  }

  private mountPreMiddlewares(): void {
    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    this.express.use(bodyParser.urlencoded({ extended: true }));

    auth.init(this.express);
    socialAuth.init(this.express);
  }

  private mountPostMiddlewares(): void {}

  /**
   * Mounts angular using Server-Side-Rendering (Recommended for SEO)
   */
  private mountAngularSSR(): void {
    const DIST_FOLDER = path.join(__dirname, 'dist');
    const ngApp = require(path.join(DIST_FOLDER, 'server'));
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

  private mountRoutes(): void {
    // Import the API and log every request being made to it
    this.express.use('/api', getExpressLoggingMiddleware(), require('./api/api.routes'));
  }
}

// The express instance is reachable through the public express property.
export default new App();
