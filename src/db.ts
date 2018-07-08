import * as mongoose from 'mongoose';
import config from './config';

export class Database {
  init(callback: () => void): void {
    mongoose.connect(config.DB_URI);
    var db = mongoose.connection;
    
    db.on(
      'error',
      console.error.bind(console, 'Unable to connect to MongoDB server')
    );
    db.once('open', function () {
      // we're connected!
      console.log('Connected to MongoDB server');
      this.mongoose = mongoose;
      callback();
    });
  }
}

export default new Database();
