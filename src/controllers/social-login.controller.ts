import { BodyParams, Controller, Get, PathParams } from '@tsed/common';

import { LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import * as responses from '../responses';

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
