import { assert, expect } from 'chai';

import controller from './api.controller';

describe('API Controller', async () => {
  it('should return ok action response', async () => {
    const result = await controller.test();
    expect(result.status).to.equal('ok');
  });

  it('should return error', () => {
    controller
      .errorTest()
      .then(() => {
        assert.fail(`Didn't return an error!`);
      })
      .catch(error => {
        assert.ok(true);
      });
  });

  it('should say Hello world!', async () => {
    const result = await controller.saySomething(`Hello world!`);
    expect(result.data).to.equal(`Hello world!`);
  });
});
