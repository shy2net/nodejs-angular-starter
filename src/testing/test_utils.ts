import * as chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'superagent';

import { ExpressApplication } from '@tsed/common';
import { TestContext } from '@tsed/testing';

import { UserProfileDbModel } from '../models/user-profile.db.model';
import { Server } from '../server';

let expressApp: ExpressApplication;

/**
 * Initializes the supertest and return the request object.
 */
export async function initChaiHttp(): Promise<ChaiHttp.Agent> {
  const express = await getExpressApp();
  return chai.request(express);
}

export async function getExpressApp(): Promise<ExpressApplication> {
  if (expressApp) return expressApp;

  await TestContext.bootstrap(Server)();
  expressApp = TestContext.injector.get(ExpressApplication) as ExpressApplication;
  return expressApp;
}

export async function getMockRootUserFromDB() {
  return UserProfileDbModel.findOne({ email: 'root@mail.com' });
}

export function setAdminHeaders(request: request.SuperAgentRequest): request.SuperAgentRequest {
  return request.auth('admin', { type: 'bearer' });
}
