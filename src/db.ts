import * as mongoose from 'mongoose';

import config from './config';
import { $log } from 'ts-log-debug';

export class Database {
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      mongoose.connect(config.DB_URI);
      const db = mongoose.connection;

      db.on('error', error => {
        $log.error('Unable to connect to MongoDB server: ${error}');
        reject(error);
      });

      db.once('open', function() {
        $log.info('Connected to MongoDB server');
        this.mongoose = mongoose;
        resolve();
      });
    });
  }
}

export default new Database();
