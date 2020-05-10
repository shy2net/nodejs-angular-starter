import '../testing/init_tests';

import { expect } from 'chai';

import { ActionResponse, LoginActionResponse, UserProfile } from '@shared';

import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { initChaiHttp, setAdminHeaders } from '../testing/test_utils';

describe('API Controller', async () => {
  let request: ChaiHttp.Agent;

  beforeEach(async () => {
    request = await initChaiHttp();
  });

  it('should return ok action response', async () => {
    const response = await request.get('/api/test');

    // Check if the status is ok
    expect(response).to.have.status(200);

    // Read the result
    const result: ActionResponse<void> = response.body;
    expect(result).to.be.an('object').and.to.have.property('status').which.equals('ok');
  });

  it('should return error', async () => {
    const response = await request.get('/api/error-test');

    // Check if the status is an error
    expect(response).to.have.status(400);

    // Read the result
    const result: ActionResponse<void> = response.body;
    expect(result).to.be.an('object').and.to.have.property('status').which.equals('error');
  });

  it('should say Hello world!', async () => {
    const response = await request.get('/api/say-something').query({ whatToSay: 'Hello world!' });

    // Check if the status is ok
    expect(response).to.have.status(200);

    // Read the result
    const result: ActionResponse<string> = response.body;
    expect(result).to.be.an('object').and.to.have.property('status').which.equals('ok');
    expect(result).to.have.property('data').which.equals('Hello world!');
  });

  it('should login as root and obtain a token', async () => {
    const response = await setAdminHeaders(
      request.post('/api/login').send({ username: 'root@mail.com', password: 'root' })
    );

    expect(response).to.have.status(200);

    const result: LoginActionResponse = response.body;

    expect(result).to.be.an('object').and.have.property('status').which.eq('ok');
    expect(result).to.have.property('data').which.is.an('object').and.have.keys('token', 'profile');

    expect(result.data.token).to.be.a('string').which.have.length.greaterThan(0);
    expect(result.data.profile).to.be.an('object').which.has.property('email').that.eq('root@mail.com');
  });

  it('should fail to login as root with an invalid password', async () => {
    const response = await setAdminHeaders(
      request.post('/api/login').send({ username: 'root@mail.com', password: 'wrongpassword' })
    );

    expect(response).to.have.status(400);

    const result: LoginActionResponse = response.body;

    expect(result).to.be.an('object').and.have.property('status').which.eq('error');
    expect(result).not.to.have.property('data');
  });

  it('should return the root user profile', async () => {
    const response = await setAdminHeaders(request.get('/api/profile'));

    expect(response).to.have.status(200);

    const result: UserProfile = response.body;

    expect(result).to.be.an('object').which.have.property('email').that.eq('root@mail.com');
  });

  it('should fail to return a user profile', async () => {
    const response = await request.get('/api/profile');

    expect(response).to.have.status(401);

    const result: ActionResponse<void> = response.body;

    expect(result).to.be.an('object').and.have.property('status').which.eq('error');
    expect(result).not.to.have.property('data');
  });

  it('should access route /admin successfully', async () => {
    const response = await setAdminHeaders(request.get('/api/admin'));

    expect(response).to.have.status(200);

    const result: ActionResponse<void> = response.body;

    expect(result).to.be.an('object').which.have.property('status').that.eq('ok');
  });

  it('should fail to access route /admin', async () => {
    const response = await request.get('/api/admin');

    expect(response).to.have.status(401);

    const result: ActionResponse<void> = response.body;

    expect(result).to.be.an('object').and.have.property('status').which.eq('error');
  });

  it('should register a new user successfully', async () => {
    const testUser = generateMockUser();
    const response = await request.post('/api/register').send(testUser);

    expect(response).to.have.status(200);

    const result: UserProfile = response.body;

    // Check if the created user is identical (remove fields that are not returned)
    expect(result).to.be.an('object').excluding(['__v', '_id', 'password']).deep.eq(testUser);
  });

  it('should fail to register a new user because one field is not valid', async () => {
    const testUser: UserProfile = generateMockUser();
    testUser.email = 'notanemail';

    const response = await request.post('/api/register').send(testUser);

    expect(response).to.have.status(400);

    const result: ActionResponse<void> = response.body;
    expect(result).to.be.an('object').and.have.property('status').which.eq('error');
  });
});
