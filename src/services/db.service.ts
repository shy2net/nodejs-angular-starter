import * as mongoose from 'mongoose';
import { $log } from '@tsed/common';

import { Service } from '@tsed/di';

import config from '../config';

@Service()
export class DatabaseService {
  $onInit() {
    return new Promise((resolve, reject) => {
      $log.info(`Connecting to database...`);
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
