import { expect } from 'chai';

import { UserProfile } from '../../shared/models';
import { generateMockUser } from '../../shared/testing/mock/user.mock';
import { RegisterForm } from './register.form';

describe('RegisterForm', () => {
  let user: UserProfile;
  let registerForm: RegisterForm;

  before(async () => {
    user = generateMockUser();
    registerForm = new RegisterForm();

    // Set the user properties in the object
    Object.assign(registerForm, user);
  });

  it('should return a hashed password', async () => {
    const result = await registerForm.getHashedPassword();
    expect(result).to.be.a('string').and.have.length.greaterThan(0);
  });
});
