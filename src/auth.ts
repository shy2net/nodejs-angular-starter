import { Application, Request, Response } from 'express';
import { AppRequest, AppResponse } from './models';

import * as createError from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as bearerToken from 'express-bearer-token';
import config from './config';

import { IUserProfileModel } from './models/user-profile.model';
import { UserProfileModel } from './models';
import { EDESTADDRREQ } from 'constants';

export class Authentication {
  init(express: Application) {
    // Allow parsing bearer tokens easily
    express.use(bearerToken());
  }

  /**
   * Checks if the provided username and password valid, if so, returns the user match. If not, returns null.
   * @param username 
   * @param password 
   */
  authenticate(username: string, password: string): Promise<IUserProfileModel> {
    return UserProfileModel.findOne({ username }).then(user => {
      return bcrypt.compare(password, user.password).then(match => {
        return match && user;
      });
    });
  }

  authenticationMiddleware(req: AppRequest, res: AppResponse, next: () => void) {
    if (req.token) {
      const decodedUser = jwt.verify(req.token, config.JWT_SECRET) as IUserProfileModel;

      if (decodedUser) {
        return UserProfileModel.findById(decodedUser._id).then(user => {
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
   * Generates a JWT token with the specified user data.
   * @param user 
   */
  generateToken(user: IUserProfileModel): string {
    return jwt.sign(user.toJSON(), config.JWT_SECRET);
  }

  /**
   * Decodes a JWT token and returns the user found.
   * @param token
   */
  decodeToken(token: string): IUserProfileModel {
    return jwt.verify(token, config.JWT_SECRET) as IUserProfileModel;
  }
}

export default new Authentication();
