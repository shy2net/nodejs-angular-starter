import './middlewares/error-handler.middleware';
import './pipes/class-transformer.pipe';
import './pipes/class-validation.pipe';

import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as httpsRedirect from 'express-https-redirect';
import * as fs from 'fs';
import { ServerOptions } from 'https';
import * as path from 'path';

import {
    $log, GlobalAcceptMimesMiddleware, IRoute, ServerLoader, ServerSettings
} from '@tsed/common';

import config from './config';
import { AuthService } from './services/auth.service';
import socialAuth from './social-auth';

const rootDir = __dirname;

// Configurations we want to load
const httpPort = process.env.PORT || 3000;
const httpsPort = process.env.PORT || 443;

let httpsOptions: ServerOptions = null;

if (config.SSL_CERTIFICATE) {
  $log.info(`SSL Configurations detected, loading HTTPS certificate...`);
  try {
    httpsOptions = {
      key: fs.readFileSync(config.SSL_CERTIFICATE.KEY, 'utf8'),
      cert: fs.readFileSync(config.SSL_CERTIFICATE.CERT, 'utf8'),
      ca: fs.readFileSync(config.SSL_CERTIFICATE.CA, 'utf8'),
    };
  } catch (e) {
    httpsOptions = null;
    $log.error(`Failed to load SSL certificate!`, e);
  }
}

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json'],
  mount: {
    '/api': `${rootDir}/controllers/**/*.ts`,
  },
  httpPort,
  httpsPort: httpsOptions ? httpsPort : false,
  httpsOptions,
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  $beforeRoutesInit(): void | Promise<void> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cors(config.CORS_OPTIONS)) // Enable CORS (for angular)
      .use(compress({})) // Compress all data sent to the client
      .use(bodyParser.json()) // Use body parser for easier JSON parsing
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      );

    // If SSL certificate is configured, enable redirect to HTTPS
    if (config.SSL_CERTIFICATE) {
      $log.info(
        `SSL certificate config detected, port 80 is now being listened and redirected automatically to https!`
      );
      this.settings.httpPort = 80; // Use port '80' (usual HTTP port) to redirect all requests
      this.use('/', httpsRedirect(true));
    }

    AuthService.initMiddleware(this.expressApp);
    socialAuth.init(this.expressApp);

    return null;
  }

  /**
   * Called after routes has been mounted.
   */
  $afterRoutesInit(): void {
    // If we are not on debug mode, we need to deliver angular as well
    if (!config.DEBUG_MODE) {
      // If we want to use SSR, mount it
      if (config.USE_SSR) this.mountAngularSSR();
      else this.mountAngular(); // Just use angular normally if no ssr was defined
    }
  }

  /**
   * Mounts angular using Server-Side-Rendering (Recommended for SEO)
   */
  private mountAngularSSR(): void {
    // The dist folder of compiled angular
    const DIST_FOLDER = path.join(__dirname, 'dist');

    // The compiled server file (angular-src/server.ts) path
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ngApp = require(path.join(DIST_FOLDER, 'server/main'));

    // Init the ng-app using SSR
    ngApp.init(this.expressApp, path.join(DIST_FOLDER, '/browser'));
  }

  /**
   * Mounts angular as is with no SSR.
   */
  private mountAngular(): void {
    // Point static path to Angular 2 distribution
    this.expressApp.use(express.static(path.join(__dirname, 'dist/browser')));

    // Deliever the Angular 2 distribution
    this.expressApp.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, 'dist/browser/index.html'));
    });
  }

  /**
   * Returns the logger configurations.
   */
  private loadLoggerConfigurations() {
    // All logs are saved to the logs directory by default, you can specify custom directory in the associated configuration file ('LOGS_DIR')
    const logsDir = config.LOGS_DIR || path.join(__dirname, 'logs');

    // Add file appenders (app.log for all logs, error.log only for errors)
    $log.appenders.set('file-error-log', {
      type: 'file',
      filename: path.join(logsDir, `error.log`),
      levels: ['error'],
    });

    // --> Uncomment this line if you want to log all data
    // .set('file-log', {
    //   type: 'file',
    //   filename: path.join(logsDir, `app.log`)
    // });

    const loggerConfig = {
      debug: config.DEBUG_MODE,
      level: config.LOG_LEVEL || 'info',
      /* --> Uncomment to add request logging
        requestFields: ['reqId', 'method', 'url', 'headers', 'body', 'query', 'params', 'duration'],
        logRequest: true
        */
    };

    this.settings.set('logger', loggerConfig);
  }

  /**
   * Override set settings by configuring custom settings.
   * @param settings
   */
  protected async loadSettingsAndInjector(): Promise<IRoute[]> {
    // Apply the logger configurations
    this.loadLoggerConfigurations();

    return super.loadSettingsAndInjector();
  }

  start(): Promise<unknown> {
    if (config.DEBUG_MODE) $log.info(`Debug mode is ON`);
    $log.info(
      `** Loaded configurations for environment: ${config.ENVIRONMENT} **`
    );
    return super.start();
  }
}
