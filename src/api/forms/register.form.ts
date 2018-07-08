import * as bcrypt from 'bcrypt';

import { UserProfile } from '../../../shared/models';
import { Form } from './form';

export class RegisterForm extends Form implements UserProfile {
  email: string;
  password: string;

  getHashedPassword(): Promise<string> {
    return bcrypt.genSalt().then(salt => {
      return bcrypt.hash(this.password, salt).then(hash => {
        return hash;
      });
    });
  }

  getFormIssues() {
    const issues = [];

    if (!this.email) {
      issues.push({ property: 'username', error: 'Username is empty!' });
    }

    if (!this.password) {
      issues.push({ property: 'password', error: 'Password is empty!' });
    }

    return issues;
  }
}
