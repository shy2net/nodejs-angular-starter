import 'mocha';
import '../testing/init_tests';

import { expect, spy } from 'chai';
import { AuthService } from 'src/services/auth.service';

import { AppRequest } from '@models';
import { UserProfile } from '@shared';
import { InternalServerError, Unauthorized } from '@tsed/exceptions';
import { TestContext } from '@tsed/testing';

import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let authService: AuthService;
  const sandbox: ChaiSpies.Sandbox = spy.sandbox();
  const validToken = 'thisisavalidtoken';
  const mockedUser = { email: 'validuser' } as UserProfile;

  before(() => {
    authMiddleware = TestContext.injector.get(AuthMiddleware);
    authService = TestContext.injector.get(AuthService);
  });

  beforeEach(() => {
    sandbox.restore();

    // Mock the getUserFromToken to allow passing the database and JWT authentication
    sandbox.on(authService, 'getUserFromToken', async (token: string) => {
      if (token === validToken) {
        return mockedUser;
      } else throw new Error(`Invalid token was provided!`);
    });
  });

  it('should pass on "OPTIONS" request method', async () => {
    const mockedRequest = { method: 'OPTIONS' } as AppRequest;
    await expect(authMiddleware.use(mockedRequest, null)).not.rejectedWith();
  });

  it('should throw an UnauthorizedException because of a missing token', async () => {
    const mockedRequest = {} as AppRequest;
    await expect(authMiddleware.use(mockedRequest, null)).rejectedWith(Unauthorized);
  });

  it('should throw an InternalServerError because token is invalid', async () => {
    const mockedRequest = { token: 'dsadsadasd' } as AppRequest;
    await expect(authMiddleware.use(mockedRequest, null)).rejectedWith(InternalServerError);
  });

  it('should pass with request.user.username set to "validuser"', async () => {
    const mockedRequest = { token: validToken } as AppRequest;
    await authMiddleware.use(mockedRequest, null);
    expect(mockedRequest.user).to.eq(mockedUser);
  });

  it('should pass with request.user set to the mocked user', async () => {
    const mockedRequest = { token: validToken } as AppRequest;
    await authMiddleware.use(mockedRequest, null);
    expect(mockedRequest.user).to.eq(mockedUser);
  });
});
