import * as express from 'express';
import * as createError from 'http-errors';
import {
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  PromiseProvider
} from 'mongoose';

import {
  UserProfile,
  ActionResponse,
  LoginActionResponse
} from './../../shared/models';

import { RegisterForm } from './forms';
import { UserProfileModel } from '../models';
import * as responses from './responses';
import auth from '../auth';
import config from '../config';

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

      const token = auth.generateToken(user);
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
    // TODO: Implement your own logout mechanisem (JWT token blaclists, etc...)
    return Promise.reject(`Logout has not been implemented!`);
  }

  register(registerForm: RegisterForm): Promise<ActionResponse<UserProfile>> {
    if (!registerForm.isValid()) {
      return Promise.reject(registerForm.getFormError());
    }

    return registerForm.getHashedPassword().then(hashedPassword => {
      return UserProfileModel.create({
        username: registerForm.username,
        password: hashedPassword
      }).then(user => {
        return responses.getOkayResponse(user);
      });
    });
  }
}

export default new ApiController();
