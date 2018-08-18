import controller from './controller';
import { expect, assert } from 'chai';

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
