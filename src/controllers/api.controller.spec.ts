import 'mocha';
import '../misc/testing';

import { assert, expect } from 'chai';

import { TestContext } from '@tsed/testing';

import { ApiController } from './api.controller';

describe('API Controller', async () => {
  let controller: ApiController;

  before(() => {
    controller = TestContext.injector.get(ApiController);
  });

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
