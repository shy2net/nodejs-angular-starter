import { Application } from 'express';
import * as passport from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';

import config from './config';
import { UserProfileModel } from './models';

export class SocialAuthentication {
    init(express: Application) {
        express.use(passport.initialize());
        this.initFacebook();
    }

    initFacebook() {
        const facebookCredentails = config.SOCIAL_CREDENTAILS['facebook'] as { APP_ID: string, APP_SECRET: string };

        passport.use(new FacebookTokenStrategy(
            {
                clientID: facebookCredentails.APP_ID,
                clientSecret: facebookCredentails.APP_SECRET
            },
            (accessToken, refreshToken, profile, done) => {
                
                done(null, profile);
            })
        );
    }
}

export default new SocialAuthentication();