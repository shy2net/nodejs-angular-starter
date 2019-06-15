import { $log } from 'ts-log-debug';

import { Server } from './server';

// Initialize server
const server = new Server();

// Start the server
server
  .start()
  .then(result => {
    $log.info(`Server is now listening!`);
  })
  .catch(err => {
    $log.error(err);
  });
