import 'chai-http';
import 'superagent';

import * as chai from 'chai';
import superagent from 'superagent';

import { ExpressApplication } from '@tsed/common';
import { TestContext } from '@tsed/testing';

import { IUserProfileDbModel, UserProfileDbModel } from '../models/user-profile.db.model';
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
  expressApp = TestContext.injector.get(
    ExpressApplication
  ) as ExpressApplication;
  return expressApp;
}

export async function getMockRootUserFromDB(): Promise<IUserProfileDbModel> {
  return UserProfileDbModel.findOne({ email: 'root@mail.com' });
}

export function setAdminHeaders(
  request: superagent.SuperAgentRequest
): superagent.SuperAgentRequest {
  return request.auth('admin', { type: 'bearer' });
}
