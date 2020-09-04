import 'assert';
import 'chai-http';
import 'mocha';

import * as chai from 'chai';
import * as promisedChai from 'chai-as-promised';
import chaiExclude from 'chai-exclude';
import * as spies from 'chai-spies';

import { TestContext } from '@tsed/testing';

import { initTestDB, TestDBSetup } from './test_db_setup';

// Add chai plugins
chai.use(spies);
chai.use(promisedChai);
chai.use(chaiExclude);
// eslint-disable-next-line @typescript-eslint/no-var-requires
chai.use(require('chai-http'));

let mockSetup: TestDBSetup;

/*
Create global hooks and create a global TextContext, this
allows us to use the same db instance instead of opening it again and again
*/
before(TestContext.create);

before(async function () {
  mockSetup = await initTestDB(TestContext.injector);
});

beforeEach(async function () {
  /*
  Because API tests require database to be clean, we clean it up before tests start to run.
  You can call 'disableMockCleanup' in order to disable this feature.
  */
  if (this.currentTest.parent.title.endsWith('Controller'))
    await mockSetup.cleanup();
});

after(TestContext.reset);
