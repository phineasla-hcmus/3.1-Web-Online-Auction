import { compare } from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import {
  addUser,
  findSocialById,
  findUserByEmail,
  findUserById,
  Social,
  User,
  USER_BASIC,
} from '../models/user.model';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './secret';

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
  // Only save id to session
  done(undefined, user.userId);
});

passport.deserializeUser(async (userId: number, done) => {
  const userBasic = await findUserById(userId, USER_BASIC);
  done(null, userBasic);
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await findUserByEmail(email);
      if (!user) {
        return done(undefined, false, { message: 'User not found' });
      }
      if (!user.password) {
        // User registered with 3rd party authentication
        return done(undefined, false, {
          message: 'User registered with 3rd party authentication',
        });
      }
      const isMatch = await compare(password, user.password);
      return isMatch
        ? done(undefined, user)
        : done(undefined, false, { message: 'Invalid password' });
    }
  )
);

/**
 * http://www.passportjs.org/packages/passport-google-oauth20/
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // It seems like profile.username always undefined
      const { id, emails, username, name } = profile;
      if (!emails || !name?.givenName) {
        return done(undefined, undefined, { message: 'No email found' });
      }
      const email = emails[0].value;

      const result = await Promise.all<any>([
        findUserByEmail(email),
        findSocialById(id),
      ]);

      const user: User = result[0];
      const social: Social = result[1];

      if (!user) {
        // Create new account with info from `profile`
        const firstName = name?.givenName;
        const lastName = name?.familyName || '';
        const userId = await addUser({
          email,
          firstName,
          lastName,
        });
        
      }

      // console.log(accessToken + ' . REFRESH: ' + refreshToken, profile);
      // done(null, {
      //   userId: 1,
      //   email: 'nguyenngocthanhtam9b@gmail.com',
      //   firstName: 'Tam',
      //   lastName: 'Nguyen',
      //   roleId: 2,
      // });
    }
  )
);
