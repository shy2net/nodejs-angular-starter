import * as express from 'express';
import * as createError from 'http-errors';
import {
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult
} from 'mongoose';

import {
  UserProfile,
  ActionResponse,
  LoginActionResponse
} from './../../shared/models';
import { UserProfileModel } from '../models';
import * as responses from './responses';
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
    return null;
  }

  getProfile(user: UserProfile): Promise<UserProfile> {
    return Promise.resolve(user);
  }

  logout(): Promise<ActionResponse<any>> {
    return null;
  }
}

export default new ApiController();
