import { Application } from 'express';
import { AppRequest, AppResponse } from './models';

import * as createError from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as bearerToken from 'express-bearer-token';
import config from './config';

import { IUserProfileModel } from './models/user-profile.model';
import { UserProfileModel } from './models';
import { UserProfile } from '../shared/models';

export class Authentication {
  init(express: Application) {
    // Allow parsing bearer tokens easily
    express.use(bearerToken());
  }

  /**
   * Checks if the provided username and password valid, if so, returns the user match. If not, returns null.
   * @param email
   * @param password
   */
  authenticate(email: string, password: string): Promise<IUserProfileModel> {
    return UserProfileModel.findOne({ email }).then(user => {
      if (!user) return null;

      return bcrypt.compare(password, user.password).then(match => {
        return match && user;
      });
    });
  }

  authenticationMiddleware(
    req: AppRequest,
    res: AppResponse,
    next: () => void
  ) {
    if (req.token) {
      const decodedUser = jwt.verify(
        req.token,
        config.JWT_SECRET
      ) as IUserProfileModel;

      if (decodedUser) {
        return UserProfileModel.findById(decodedUser._id)
          .then(user => {
            req.user = user;
            return next();
          })
          .catch(error => {
            throw createError(500, `Internal server error`);
          });
      }
    }

    throw createError(400, `Provided token is invalid!`);
  }

  /**
   * This middleware is responsible of of checking if a user has a specific role.
   * Must be used after the authenticationMiddleware.
   */
  getHasRoleMiddlware(role: string) {
    return (req: AppRequest, res: AppResponse, next: () => void) => {
      if (req.user.roles.find(userRole => role === userRole)) {
        next();
      }

      throw createError(400, `You don't have the role to access this route`);
    };
  }

  /**
   * Generates a JWT token with the specified user data.
   * @param user
   */
  generateToken(user: UserProfile): string {
    return jwt.sign(user, config.JWT_SECRET);
  }

  /**
   * Decodes a JWT token and returns the user found.
   * @param token
   */
  decodeToken(token: string): UserProfile {
    return jwt.verify(token, config.JWT_SECRET) as UserProfile;
  }
}

export default new Authentication();
