import { SocialLoginModule } from './social-login.module';

describe('SocialLoginModule', () => {
  let socialLoginModule: SocialLoginModule;

  beforeEach(() => {
    socialLoginModule = new SocialLoginModule();
  });

  it('should create an instance', () => {
    expect(socialLoginModule).toBeTruthy();
  });
});
