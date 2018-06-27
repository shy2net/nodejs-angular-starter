import * as express from 'express';
import * as createError from 'http-errors';
import * as responses from './responses';
import config from '../config';

class ApiController {
  test() {
    return responses.getOkayResponse();
  }

  errorTest() {
    throw createError(401, 'This is an errro!');
  }

  login(username, password) {

  }

  getProfile() {
    
  }

  logout() {

  }
}

export default new ApiController();
