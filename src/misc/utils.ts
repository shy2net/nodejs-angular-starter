import * as bcrypt from 'bcryptjs';

import { UserProfile } from '../../shared/models/user-profile';
import { IUserProfileDbModel, UserProfileDbModel } from '../models/user-profile.db.model';

export function getHashedPassword(password: string): Promise<string> {
  return bcrypt.genSalt().then((salt) => {
    return bcrypt.hash(password, salt).then((hash) => {
      return hash;
    });
  });
}

export async function saveUser(
  user: UserProfile
): Promise<IUserProfileDbModel> {
  return UserProfileDbModel.create({
    ...user,
    password: await getHashedPassword(user.password),
  });
}
