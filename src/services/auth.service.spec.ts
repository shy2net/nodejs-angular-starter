import 'mocha';
import '../testing/init_tests';

import { expect, spy } from 'chai';

import { Unauthorized } from '@tsed/exceptions';
import { TestContext } from '@tsed/testing';

import { getMockRootUserFromDB } from '../testing/test_utils';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const sandbox: ChaiSpies.Sandbox = spy.sandbox();

  before(() => {
    authService = TestContext.injector.get(AuthService);
  });

  beforeEach(() => {
    sandbox.restore();
  });

  it('should authenticate successfully', async () => {
    const user = await authService.authenticate('root@mail.com', 'root');
    expect(user).to.be.an('object').and.have.property('email').which.eq('root@mail.com');
  });

  it('should fail to authenticate and return Unauthorized exception', async () => {
    await expect(authService.authenticate('random@mail.com', 'randompassword')).to.be.rejectedWith(
      Unauthorized
    );
  });

  it('should generate a token for the provided user and decode it back', async () => {
    const rootUser = (await getMockRootUserFromDB()).toJSON();
    const token = authService.generateToken(rootUser);
    expect(token).to.be.a('string').and.have.length.greaterThan(0);

    // Expect the root user to be equal to the decoded user from the token
    const decodedUser = authService.decodeToken(token);
    expect(decodedUser).excluding(['iat', '_id']).to.be.deep.eq(rootUser);
  });
});
