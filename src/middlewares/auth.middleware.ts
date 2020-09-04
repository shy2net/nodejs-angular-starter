import { DocumentQuery } from 'mongoose';

import { EndpointInfo, IMiddleware, Middleware, Req } from '@tsed/common';
import { Forbidden, InternalServerError, Unauthorized } from '@tsed/exceptions';

import config from '../config';
import { AppRequest } from '../models/app-req-res';
import { IUserProfileDbModel } from '../models/user-profile.db.model';
// import { AppRequest, IUserProfileDbModel, UserProfileDbModel } from '@models';
import { AuthService } from '../services/auth.service';

/**
 * This authentication middleware validates the user token, makes sure if it is still valid in the database
 * and checks if the user has the specified (if specified) role.
 */
@Middleware()
export class AuthMiddleware implements IMiddleware {
  constructor(private auth: AuthService) {}

  public async use(
    @Req() request: AppRequest,
    @EndpointInfo() endpoint: EndpointInfo
  ): Promise<unknown> {
    // Always allow OPTIONS requests to pass
    if (request.method === 'OPTIONS') return;

    // retrieve options given to the @UseAuth decorator
    const options = (endpoint && endpoint.get(AuthMiddleware)) || {};

    const handleUserPromise = (
      promise: DocumentQuery<IUserProfileDbModel, IUserProfileDbModel>
    ) => {
      return promise
        .then((user) => {
          request.user = user;

          // If any roles were specified, check if the user has it
          if (options && options.role) {
            if (user.roles.findIndex((role) => role === options.role) === -1)
              throw new Forbidden(`You don't have the permissions required!`);
          }
        })
        .catch((err: unknown) => {
          throw new InternalServerError(
            `An error had occurred while authenticating user`,
            err
          );
        });
    };

    // Check if we have a token
    if (request.token) {
      // If we are working on test, allow special cases instead of using full tokens
      if (config.ENVIRONMENT === 'test') {
        switch (request.token) {
          case 'admin':
            return handleUserPromise(this.auth.getUserFromDB('root@mail.com'));
        }
      }

      // if it's a normal authentication scenario, allow it
      return handleUserPromise(this.auth.getUserFromToken(request.token));
    }

    throw new Unauthorized(`No credentials were provided!`);
  }
}
