import * as express from 'express';
import * as path from 'path';

import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';

import auth from './auth';
import config from './config';
import db from './db';
import logger from './logger';
import socialAuth from './social-auth';

const bodyParser = require('body-parser');
const compress = require('compression');
const rootDir = __dirname;
const port = process.env.PORT || 3000;

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json'],
  port,
  mount: {
    '/api': `${rootDir}/controllers/**/*.ts`
  }
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  $onMountingMiddlewares(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(compress({}))
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );

    auth.init(this.expressApp);
    socialAuth.init(this.expressApp);

    return null;
  }

  /**
   * Mounts angular using Server-Side-Rendering (Recommended for SEO)
   */
  private mountAngularSSR(): void {
    const DIST_FOLDER = path.join(__dirname, 'dist');
    const ngApp = require(path.join(DIST_FOLDER, 'server'));
    ngApp.init(this.expressApp, DIST_FOLDER);
  }

  /**
   * Mounts angular as is with no SSR.
   */
  private mountAngular(): void {
    // Point static path to Angular 2 distribution
    this.expressApp.use(express.static(path.join(__dirname, 'dist/browser')));

    // Deliever the Angular 2 distribution
    this.expressApp.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
    });
  }

  start() {
    if (config.DEBUG_MODE) logger.info(`Debug mode is ON`);
    logger.info(`** Loaded configurations for environment: ${config.ENVIRONMENT} **`);
    logger.info(`Connecting to database...`);

    return db.init().then(result => {
      // If we are not on debug mode, run angular
      if (!config.DEBUG_MODE) this.mountAngular();

      // TODO: Replace with this line to use express logging middleware to log every request
      // this.express.use('/api', getExpressLoggingMiddleware(), require('./api/api.routes'));

      return super.start();
    });
  }
}
