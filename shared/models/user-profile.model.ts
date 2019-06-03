import { Form } from './forms';
import { UserProfile } from './user-profile';
import { IsEmail, MinLength } from 'class-validator';

export class UserProfileModel extends Form implements UserProfile {
  @IsEmail()
  email: string;

  @MinLength(1)
  firstName: string;
  @MinLength(1)
  lastName: string;
  @MinLength(6)
  password: string;

  roles?: string[];
}
