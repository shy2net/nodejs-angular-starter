import { LoginActionResponse, UserProfile } from "../../../shared/models";
import auth from "../../auth";
import * as responses from "../responses";

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
