import { $log } from '@tsed/common';

import { Server } from './server';

// Initialize server
const server = new Server();

// Start the server
server
  .start()
  .then(() => {
    $log.info(`Server is now listening!`);
  })
  .catch((err) => {
    $log.error(err);
  });
