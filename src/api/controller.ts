import * as express from 'express';
import * as responses from './responses';
import config from '../config';

class ApiController {
  test() {
    return responses.getOkayResponse();
  }

  login(username, password) {

  }

  getProfile() {
    
  }

  logout() {

  }
}

export default new ApiController();
