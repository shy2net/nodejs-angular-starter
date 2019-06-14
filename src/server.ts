import * as express from 'express';
import * as path from 'path';
import { $log } from 'ts-log-debug';

import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';

import auth from './auth';
import config from './config';
import db from './db';
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

  /**
   * Configures all of the logging in the server.
   */
  private configureLogging() {
    this.setSettings({
      ...this.settings,
      logger: {
        ...this.settings.logger,
        debug: config.DEBUG_MODE,
        level: config.DEBUG_MODE ? 'debug' : 'info',
        requestFields: ['reqId', 'method', 'url', 'headers', 'body', 'query', 'params', 'duration'],
        logRequest: true
      }
    });

    // All logs are saved to the logs directory by default
    const logsDir = path.join(__dirname, 'logs');

    // Add file appenders (app.log for all logs, error.log only for errors)
    $log.appenders
      .set('file-log', {
        type: 'file',
        filename: path.join(logsDir, `app.log`)
      })
      .set('file-error-log', {
        type: 'file',
        filename: path.join(logsDir, `error.log`),
        levels: ['error']
      });
  }

  start() {
    this.configureLogging();

    if (config.DEBUG_MODE) $log.info(`Debug mode is ON`);
    $log.info(`** Loaded configurations for environment: ${config.ENVIRONMENT} **`);
    $log.info(`Connecting to database...`);

    return db.init().then(result => {
      // If we are not on debug mode, mount angular
      if (!config.DEBUG_MODE) this.mountAngular();

      return super.start();
    });
  }
}
