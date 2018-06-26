import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';

import config from './config';

// App class will encapsulate our web server.
export class App {
  public express: express.Application;
  public mongoose;

  constructor() {}

  init(port: string | number, ready?: () => void) {
    this.express = express();
    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());
    console.log(`Connecting to database...`);

    this.initDatabase(() => {
      this.mountRoutes();

      this.express.listen(port);
      console.log(`Server is now listening on port ${port}...`);
      ready && ready();
    });
  }

  private mountMiddlewares(): void {
    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());

    this.express.use(morgan('dev'));
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

  private initDatabase(callback: () => void): void {
    mongoose.connect(config.DB_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Unable to connect to MongoDB server'));
    db.once('open', function() {
      // we're connected!
      console.log('Connected to MongoDB server');
      this.mongoose = mongoose;
      callback();
    });
  }
}

// The express instance is reachable through the public express property.
export default new App();
