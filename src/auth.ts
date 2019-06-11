import * as bcrypt from 'bcryptjs';
import { Application } from 'express';
import * as bearerToken from 'express-bearer-token';
import * as jwt from 'jsonwebtoken';

import { UserProfile } from '../shared/models';
import config from './config';
import { UserProfileDbModel } from './models';
import { IUserProfileDbModel } from './models/user-profile.db.model';

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
  authenticate(email: string, password: string): Promise<IUserProfileDbModel> {
    return UserProfileDbModel.findOne({ email }).then(user => {
      if (!user) return null;

      return bcrypt.compare(password, user.password).then(match => {
        return match && user;
      });
    });
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
