import { ActionResponse, LoginActionResponse, UserProfile } from '@shared';
import { BodyParams, Controller, Get, Post, QueryParams, UseBefore } from '@tsed/common';
import { BadRequest } from '@tsed/exceptions';

import { RequestUser } from '../decorators/request-user.decorator';
import { RegisterForm } from '../forms';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UserProfileDbModel } from '../models';
import * as responses from '../responses';
import { AuthService } from '../services/auth.service';

@Controller('/')
export class ApiController {
  constructor(private authService: AuthService) {}

  @Get('/test')
  test(): ActionResponse<void> {
    return responses.getOkayResponse();
  }

  @Get('/error-test')
  errorTest(): ActionResponse<void> {
    throw new BadRequest('This is an error!');
  }

  @Get('/say-something')
  saySomething(
    @QueryParams('whatToSay') whatToSay: string
  ): ActionResponse<string> {
    return responses.getOkayResponse<string>(whatToSay);
  }

  @Post('/login')
  login(
    @BodyParams('username') username: string,
    @BodyParams('password') password: string
  ): Promise<LoginActionResponse> {
    return this.authService.authenticate(username, password).then((user) => {
      if (!user) throw new BadRequest(`Username or password are invalid!`);

      const token = this.authService.generateToken(user.toJSON());
      const response = responses.getOkayResponse();

      return {
        ...response,
        data: {
          token: token,
          profile: user,
        },
      };
    });
  }

  @Get('/profile')
  @UseBefore(AuthMiddleware)
  getProfile(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }

  @Get('/admin')
  @UseBefore(AuthMiddleware)
  adminTest(): ActionResponse<void> {
    return this.test();
  }

  @Get('/logout')
  @UseBefore(AuthMiddleware)
  logout(): Promise<ActionResponse<void>> {
    // TODO: Implement your own logout mechanisem (JWT token blacklists, etc...)
    return Promise.reject(`Logout has not been implemented!`);
  }

  // TODO: Maybe move to model validations of Ts.ED? http://v4.tsed.io/docs/model.html#example
  @Post('/register')
  register(
    // Don't validate using the built in models
    @BodyParams() registerForm: RegisterForm
  ): Promise<UserProfile> {
    // Hash the user password and create it afterwards
    return registerForm.getHashedPassword().then((hashedPassword) => {
      return UserProfileDbModel.create({
        ...registerForm,
        password: hashedPassword,
      });
    });
  }
}
