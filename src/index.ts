import { Server } from './server';

new Server()
  .start()
  .then(result => {
    console.log('Server started...');
  })
  .catch(err => {
    console.error(err);
  });
