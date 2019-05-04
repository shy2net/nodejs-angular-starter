import * as mongoose from 'mongoose';

import config from './config';
import logger from './logger';

export class Database {
  init(callback: () => void): void {
    mongoose.connect(config.DB_URI);
    const db = mongoose.connection;

    db.on('error', error => {
      logger.error('Unable to connect to MongoDB server: ${error}');
    });

    db.once('open', function() {
      logger.info('Connected to MongoDB server');
      this.mongoose = mongoose;
      callback();
    });
  }
}

export default new Database();
