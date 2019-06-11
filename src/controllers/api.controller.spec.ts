import { assert, expect } from 'chai';
import 'mocha';

import { ApiController } from './api.controller';
const controller = new ApiController();

describe('API Controller', async () => {
  it('should return ok action response', () => {
    const result = controller.test();
    expect(result.status).to.equal('ok');
  });

  it('should return error', () => {
    try {
      controller.errorTest();
      assert.fail(`Didn't return an error!`);
    } catch (error) {
      assert.ok(true);
    }
  });

  it('should say Hello world!', async () => {
    const result = await controller.saySomething(`Hello world!`);
    expect(result.data).to.equal(`Hello world!`);
  });
});
