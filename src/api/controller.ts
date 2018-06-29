import { UserProfile } from './../../shared/models';
import * as express from 'express';
import * as createError from 'http-errors';
import {
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult
} from 'mongoose';

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

  saySomething(whatToSay: string) {
    return Promise.resolve(responses.getOkayResponse(whatToSay));
  }

  login(username: string, password: string) {}

  getProfile(user: UserProfile) {
    return Promise.resolve(user);
  }

  logout() {}
}

export default new ApiController();
