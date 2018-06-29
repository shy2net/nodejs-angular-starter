import { UserProfileModel } from './models/user-profile.model';
import { UserProfileModel } from './models';
import * as passport from 'passport';

export function localAuthentication(
  username: string,
  password: string,
  done: () => void
) {
  UserProfileModel.findOne(
    { where: { username: username, password: password } },
    (err: any, user) => {
      return user;
    }
  );
}
