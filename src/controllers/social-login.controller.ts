import { LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import * as responses from '../responses';
import { Controller, BodyParams, Get, PathParams } from '@tsed/common';

@Controller('/social-login')
export class SocialLoginController {
  async socialLogin(@BodyParams() user: UserProfile): Promise<LoginActionResponse> {
    const token = auth.generateToken(user);
    return responses.getOkayResponse({
      token,
      profile: user
    });
  }
}
