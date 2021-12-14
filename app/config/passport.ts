import { compare } from 'bcrypt';
import passport from 'passport';
import passportFacebook from 'passport-facebook';
import passportLocal from 'passport-local';
import { findUserByEmail, User } from '../models/user.model';

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (user: User, done) => {
  const res = await findUserByEmail(user.email);
  delete res?.password;
  done(null, res);
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
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

      delete user.password;
      delete user.dob;
      delete user.address;

      return isMatch
        ? done(undefined, user)
        : done(undefined, false, { message: 'Invalid password' });
    }
  )
);
