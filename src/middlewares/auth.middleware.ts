import * as jwt from 'jsonwebtoken';
import { Forbidden, InternalServerError, Unauthorized } from 'ts-httpexceptions';

import { EndpointInfo, IMiddleware, Middleware, Req } from '@tsed/common';

import config from '../config';
import { AppRequest } from '../models/app-req-res';
import { IUserProfileDbModel, UserProfileDbModel } from '../models/user-profile.db.model';

// import { AppRequest, IUserProfileDbModel, UserProfileDbModel } from '@models';

/**
 * This authentication middleware validates the user token, makes sure if it is still valid in the database
 * and checks if the user has the specified (if specified) role.
 */
@Middleware()
export class AuthMiddleware implements IMiddleware {
  public use(@Req() request: AppRequest, @EndpointInfo() endpoint: EndpointInfo) {
    // Always allow OPTIONS requests to pass
    if (request.method === 'OPTIONS') return;

    // retrieve options given to the @UseAuth decorator
    const options = endpoint.get(AuthMiddleware) || {};

    // Check if we have a token
    if (request.token) {
      // Decode the token
      const decodedUser = jwt.verify(request.token, config.JWT.SECRET) as IUserProfileDbModel;

      if (decodedUser) {
        // If the user has been decoded successfully, check it against the database
        return UserProfileDbModel.findById(decodedUser._id)
          .then(user => {
            request.user = user;

            // If any roles were specified, check if the user has it
            if (options && options.role) {
              if (user.roles.findIndex(role => options.role) === -1)
                throw new Forbidden(`You don't have the permissions required!`);
            }
          })
          .catch(error => {
            throw new InternalServerError(`An error had occured while authenticating user`);
          });
      }
    }

    throw new Unauthorized(`No credentials were provided!`);
  }
}
