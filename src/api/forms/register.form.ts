import * as bcrypt from 'bcryptjs';

import { UserProfileModel } from '../../../shared/models/user-profile.model';

export class RegisterForm extends UserProfileModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  getHashedPassword(): Promise<string> {
    return bcrypt.genSalt().then(salt => {
      return bcrypt.hash(this.password, salt).then(hash => {
        return hash;
      });
    });
  }
}
