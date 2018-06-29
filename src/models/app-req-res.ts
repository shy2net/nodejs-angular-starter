import { UserProfile } from './../../shared/models';
import { Request, Response } from 'express';

export interface AppRequest extends Request {
  user: UserProfile
}

export interface AppResponse extends Response {

}
