import { compare } from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import {
  findUserByEmail,
  findUserById,
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

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // profile.id
    }
  )
);
