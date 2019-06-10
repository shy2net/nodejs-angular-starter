import * as mongoose from 'mongoose';

import config from './config';
import logger from './logger';

export class Database {
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      mongoose.connect(config.DB_URI);
      const db = mongoose.connection;

      db.on('error', error => {
        logger.error('Unable to connect to MongoDB server: ${error}');
        reject(error);
      });

      db.once('open', function() {
        logger.info('Connected to MongoDB server');
        this.mongoose = mongoose;
        resolve();
      });
    });
  }
}

export default new Database();
