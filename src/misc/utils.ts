import * as bcrypt from 'bcryptjs';

import { UserProfile } from '../../shared/models/user-profile';
import { UserProfileDbModel } from '../models/user-profile.db.model';

export function getHashedPassword(password: string) {
  return bcrypt.genSalt().then((salt) => {
    return bcrypt.hash(password, salt).then((hash) => {
      return hash;
    });
  });
}

export async function saveUser(user: UserProfile) {
  return  UserProfileDbModel.create({
    ...user,
    password: await getHashedPassword(user.password),
  });
}
