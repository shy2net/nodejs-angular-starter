import { Application } from 'express';
import * as passport from 'passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import * as randomstring from 'randomstring';

import config from './config';
import { UserProfileModel } from './models';
import { UserProfile } from '../shared/models';
import { IUserProfileModel } from './models/user-profile.model';

export class SocialAuthentication {
    init(express: Application) {
        express.use(passport.initialize());
        this.initFacebook();
        this.initGoogle();
    }

    initFacebook() {
        const facebookCredentails = config.SOCIAL_CREDENTAILS['facebook'] as { APP_ID: string, APP_SECRET: string };

        passport.use(new FacebookTokenStrategy(
            {
                clientID: facebookCredentails.APP_ID,
                clientSecret: facebookCredentails.APP_SECRET
            },
            (accessToken, refreshToken, profile, done) => {
                const fbProfile = profile._json;
                const email = fbProfile.email as string;

                this.findOrCreateUser(email,
                    fbProfile,
                    {
                        'email': 'email',
                        'first_name': 'firstName',
                        'last_name': 'lastName'
                    }).then(user => {
                        done(null, user.toJSON());
                    })
                    .catch(error => {
                        done(error, null);
                    });
            })
        );
    }

    initGoogle() {
        const googleCredentails = config.SOCIAL_CREDENTAILS['google'] as { APP_ID: string, APP_SECRET: string };

        passport.use(new GoogleTokenStrategy({
            clientID: googleCredentails.APP_ID,
        },
            (accessToken, refreshToken, profile, done) => {
                const googleProfile = profile._json;
                const email = googleProfile.email;

                this.findOrCreateUser(email,
                    googleProfile,
                    {
                        'email': 'email',
                        'given_name': 'firstName',
                        'family_name': 'lastName'
                    }).then(user => {
                        done(null, user.toJSON());
                    })
                    .catch(error => {
                        done(error, null);
                    });
            }
        ));
    }

    /**
     * Finds a user based on the provided email. If the email provided already exists, returns a token
     * for that user. If the user's email does not exist in the database, create the user according
     * to the profile fetched from the 3rd party and saves it.
     * @param email
     * @param socialProfile
     * @param map
     */
    async findOrCreateUser(email: string, socialProfile: any, map: {}): Promise<IUserProfileModel> {
        const user = await UserProfileModel.findOne({ email });

        if (user) {
            return user;
        }

        return UserProfileModel.create(this.createUserFromSocialProfile(socialProfile, map));
    }

    /**
     * Fills the user profile data from the provided social profile using the map specified
     * @param socialProfile The social profile containing the data we want to transfer to our own user profile
     * @param userProfile Our user profile To save the data into
     * @param map A dictionary that associates the social profile fiels to the user profile fields
     */
    createUserFromSocialProfile(socialProfile: any, map: {}) {
        const userProfile = {} as UserProfile;

        Object.keys(map).forEach(key => {
            const userKey = map[key];
            userProfile[userKey] = socialProfile[key];
        });

        // Generate a random password for this user
        userProfile.password = randomstring.generate();

        return userProfile;
    }
}

export default new SocialAuthentication();
