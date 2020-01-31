import 'assert';
import 'mocha';

import { TestContext } from '@tsed/testing';

/*
Create global hooks and create a global TextContext, this
allows us to use the same db instance instead of opening it again and again
*/
before(async () => {
  await TestContext.create();
});

beforeEach(function() {});

after(async () => {
  await TestContext.reset();
});
