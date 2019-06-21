import './middlewares/error-handler.middleware';

import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import { $log } from 'ts-log-debug';

import {
  GlobalAcceptMimesMiddleware,
  ServerLoader,
  ServerSettings,
  IServerSettings,
  ILoggerSettings
} from '@tsed/common';

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
  },
  httpsPort: false
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  $onMountingMiddlewares(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cors(config.CORS_OPTIONS)) // Enable CORS (for angular)
      .use(compress({})) // Compress all data sent to the client
      .use(bodyParser.json()) // Use body parser for easier JSON parsing
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
   * Called after routes has been mounted.
   */
  $afterRoutesInit(): void {
    // If we are not on debug mode, mount angular
    if (!config.DEBUG_MODE) this.mountAngular();
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
   * Returns the logger configurations.
   */
  private getLoggerConfigurations(settings: IServerSettings): Partial<ILoggerSettings> {
    // All logs are saved to the logs directory by default, you can specify custom directory in the associated configuration file ('LOGS_DIR')
    const logsDir = config.LOGS_DIR || path.join(__dirname, 'logs');

    // Add file appenders (app.log for all logs, error.log only for errors)
    $log.appenders.set('file-error-log', {
      type: 'file',
      filename: path.join(logsDir, `error.log`),
      levels: ['error']
    });

    // --> Uncomment this line if you want to log all data
    // .set('file-log', {
    //   type: 'file',
    //   filename: path.join(logsDir, `app.log`)
    // });

    return {
      ...settings.logger,
      debug: config.DEBUG_MODE,
      level: config.DEBUG_MODE ? 'debug' : 'info'
      /* --> Uncomment to add request logging
        requestFields: ['reqId', 'method', 'url', 'headers', 'body', 'query', 'params', 'duration'],
        logRequest: true
        */
    };
  }

  /**
   * Returns the SSL (https) if any configured for this environment.
   */
  getSSLConfigurations() {
    const sslConfig = config.SSL_CERTIFICATE;

    if (!sslConfig) return {};

    return {
      httpsPort: 443,
      httpsOptions: {
        key: sslConfig.KEY,
        cert: sslConfig.CERT,
        ca: sslConfig.CA
      }
    };
  }

  /**
   * Override set settings by configuring custom settings.
   * @param settings
   */
  setSettings(settings: IServerSettings) {
    super.setSettings({
      ...settings,
      logger: this.getLoggerConfigurations(settings),
      ...this.getSSLConfigurations()
    });
  }

  start() {
    if (config.DEBUG_MODE) $log.info(`Debug mode is ON`);
    $log.info(`** Loaded configurations for environment: ${config.ENVIRONMENT} **`);
    $log.info(`Connecting to database...`);

    return db.init().then(result => {
      return super.start();
    });
  }
}
