import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';

import db from './db';
import auth from './auth';
import config from './config';

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
      this.mountPostMiddlewares();

      this.express.listen(port);
      console.log(`Server is now listening on port ${port}...`);
      ready && ready();
    });
  }

  private mountPreMiddlewares(): void {
    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());

    this.express.use(morgan('dev'));

    // Initialize authentication using passport
    auth.init(this.express);
  }

  private mountPostMiddlewares(): void {}

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
