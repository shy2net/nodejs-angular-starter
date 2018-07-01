import { UserProfile } from './../../shared/models';
import { Request, Response } from 'express';

export interface AppRequest extends Request {
  user: UserProfile
  decodedTokenUser: UserProfile;
  token: string; // Because express-bearer-token does not come with types, we include this type in the app request
}

export interface AppResponse extends Response {

}
