import { Server } from './server';

const port = process.env.PORT || 3000;

new Server()
  .start()
  .then(result => {
    console.log('Server started...');
  })
  .catch(err => {
    console.error(err);
  });
