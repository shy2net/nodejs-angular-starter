import { Document, model, Model, Schema, Promise } from 'mongoose';
import * as mongoose from 'mongoose';

import { UserProfile } from '../../shared/models';

export interface IUserProfileModel extends UserProfile, Document {}

export const UserProfileSchema = new Schema({
  username: {
    unique: true,
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserProfileSchema.methods.toJSON = function() {
  const instance = (this as IUserProfileModel).toObject();
  delete instance.password; // Remove the password field
  return instance;
};

export const UserProfileModel: Model<IUserProfileModel> = model<
  IUserProfileModel
>('user', UserProfileSchema);
