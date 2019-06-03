import { transformAndValidate } from 'class-transformer-validator';
import * as createError from 'http-errors';

import { ActionResponse, LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import { UserProfileDbModel } from '../models';
import { RegisterForm } from './forms';
import * as responses from './responses';

class ApiController {
  test() {
    return Promise.resolve(responses.getOkayResponse());
  }

  errorTest() {
    return Promise.reject(createError(401, 'This is an error!'));
  }

  saySomething(whatToSay: string): Promise<ActionResponse<string>> {
    return Promise.resolve(responses.getOkayResponse(whatToSay));
  }

  login(username: string, password: string): Promise<LoginActionResponse> {
    return auth.authenticate(username, password).then(user => {
      if (!user) {
        throw createError(400, `Username or password are invalid!`);
      }

      const token = auth.generateToken(user.toJSON());
      const response = responses.getOkayResponse();

      return {
        ...response,
        data: {
          token: token,
          profile: user
        }
      };
    });
  }

  getProfile(user: UserProfile): Promise<UserProfile> {
    return Promise.resolve(user);
  }

  logout(): Promise<ActionResponse<any>> {
    // TODO: Implement your own logout mechanisem (JWT token blacklists, etc...)
    return Promise.reject(`Logout has not been implemented!`);
  }

  register(userProfile: UserProfile): Promise<UserProfile> {
    return transformAndValidate(RegisterForm, userProfile).then((registerForm: RegisterForm) => {
      return registerForm.getHashedPassword().then(hashedPassword => {
        return UserProfileDbModel.create({
          ...registerForm,
          password: hashedPassword
        });
      });
    });
  }
}

export default new ApiController();
