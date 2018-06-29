import * as express from 'express';
import * as createError from 'http-errors';
import * as responses from './responses';
import config from '../config';

class ApiController {
  test() {
    return Promise.resolve(responses.getOkayResponse());
  }

  errorTest() {
    return Promise.reject(createError(401, 'This is an error!'));
  }

  login(username, password) {

  }

  getProfile() {

  }

  logout() {

  }
}

export default new ApiController();
