import { EndpointInfo, IMiddleware, Middleware, Req } from '@tsed/common';
import { Forbidden, Unauthorized, InternalServerError } from 'ts-httpexceptions';
import { AppRequest } from '../models';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { IUserProfileDbModel, UserProfileDbModel } from '../models/user-profile.db.model';

/**
 * This authentication middleware validates the user token, makes sure if it is still valid in the database
 * and checks if the user has the specified (if specified) role.
 */
@Middleware()
export class AuthMiddleware implements IMiddleware {
  public use(@Req() request: AppRequest, @EndpointInfo() endpoint: EndpointInfo) {
    // retrieve options given to the @UseAuth decorator
    const options = endpoint.get(AuthMiddleware) || {};

    // Check if we have a token
    if (request.token) {
      // Decode the token
      const decodedUser = jwt.verify(request.token, config.JWT_SECRET) as IUserProfileDbModel;

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

    throw new Unauthorized(`No credentails were provided!`);
  }
}
