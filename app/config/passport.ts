import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook from 'passport-facebook';

import { findUserByEmail, findUserById } from '../models/user.model';
import { compare } from 'bcrypt';

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((req, user, done) => done(undefined, user));

passport.deserializeUser((id: string, done) => done(null, findUserById(id)));

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const user = await findUserByEmail(email);
      if (!user) {
        return done(undefined, false);
      }
      const isMatch = await compare(password, user.password);
      // Only save userId to client session
      return isMatch
        ? done(undefined, { userId: user.userId })
        : done(undefined, false);
    }
  )
);
