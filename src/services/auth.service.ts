import * as bcrypt from 'bcryptjs';
import { Application } from 'express';
import * as bearerToken from 'express-bearer-token';
import * as jwt from 'jsonwebtoken';
import { DocumentQuery } from 'mongoose';

import { Service } from '@tsed/di';
import { Unauthorized } from '@tsed/exceptions';

import { UserProfile } from '../../shared/models';
import config from '../config';
import { UserProfileDbModel } from '../models';
import { IUserProfileDbModel } from '../models/user-profile.db.model';

@Service()
export class AuthService {
  static initMiddleware(express: Application): void {
    // Allow parsing bearer tokens easily
    express.use(bearerToken());
  }

  /**
   * Checks if the provided username and password valid, if so, returns the user match. If not, returns null.
   * @param email
   * @param password
   */
  authenticate(email: string, password: string): Promise<IUserProfileDbModel> {
    return UserProfileDbModel.findOne({ email }).then((user) => {
      if (!user) throw new Unauthorized('Email or password are invalid!');

      return bcrypt.compare(password, user.password).then((match) => {
        return match && user;
      });
    });
  }

  getUserFromDB(
    email: string
  ): DocumentQuery<IUserProfileDbModel, IUserProfileDbModel, unknown> {
    return UserProfileDbModel.findOne({ email });
  }

  getUserFromToken(
    token: string
  ): DocumentQuery<IUserProfileDbModel, IUserProfileDbModel, unknown> {
    // Decode the token
    const decodedUser = jwt.verify(
      token,
      config.JWT.SECRET
    ) as IUserProfileDbModel;

    if (decodedUser) {
      // If the user has been decoded successfully, check it against the database
      return UserProfileDbModel.findById(decodedUser._id);
    }
  }

  /**
   * Generates a JWT token with the specified user data.
   * @param user
   */
  generateToken(user: UserProfile): string {
    return jwt.sign(user, config.JWT.SECRET, config.JWT.OPTIONS);
  }

  /**
   * Decodes a JWT token and returns the user found.
   * @param token
   */
  decodeToken(token: string): UserProfile {
    return jwt.verify(
      token,
      config.JWT.SECRET,
      config.JWT.VERIFY_OPTIONS
    ) as UserProfile;
  }
}
