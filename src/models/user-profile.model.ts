import { Document, model, Model, Schema, Promise } from 'mongoose';
import * as mongoose from 'mongoose';

import { UserProfile } from '../../shared/models';

export interface IUserProfileModel extends UserProfile, Document {}

export const UserProfileSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export const UserProfileModel: Model<IUserProfileModel> = model<
  IUserProfileModel
>('user', UserProfileSchema);
