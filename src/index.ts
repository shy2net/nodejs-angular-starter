import { $log } from 'ts-log-debug';

import { Server } from './server';

const server = new Server();

server
  .start()
  .then(result => {
    $log.info(`Server is now listening!`);
  })
  .catch(err => {
    $log.error(err);
  });
