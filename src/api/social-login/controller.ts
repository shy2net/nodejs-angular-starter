import * as responses from '../responses';
import auth from '../../auth';
import { UserProfile, LoginActionResponse } from '../../../shared/models';

class SocialLoginController {
  async socialLogin(user: UserProfile): Promise<LoginActionResponse> {
    const token = auth.generateToken(user);
    return responses.getOkayResponse({
      token,
      profile: user
    });
  }
}

export default new SocialLoginController();
