import { compare } from 'bcrypt';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportLocal from 'passport-local';
import { RoleType } from '../models/role.model';
import {
  addSocial,
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
      if (user.banned) {
        return done(undefined, false, {
          message: 'User has been banned',
        });
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
      // It seems like `profile.username` and `refreshToken` always undefined
      // I also don't know what `accessToken` is used for
      const { id, emails, name } = profile;
      if (!emails || !name?.givenName) {
        return done(undefined, undefined, { message: 'No email found' });
      }
      const email = emails[0].value;

      const result = await Promise.all<any>([
        findUserByEmail(email, [...USER_BASIC, 'banned']),
        findSocialById(id),
      ]);

      let user: Partial<User> | undefined = result[0];
      const social: Social | undefined = result[1];

      let userId = user?.userId;
      const firstName = name?.givenName;
      const lastName = name?.familyName || '';

      if (!user) {
        // Create new account with info from `profile`
        // Also skip verification because Google is trustworthy, right?
        user = { email, firstName, lastName, roleId: RoleType.Bidder };
        userId = await addUser(user);
        user.userId = userId;
      } else if (user.banned) {
        return done(undefined, undefined, { message: 'User have been banned' });
      }
      // `userId` should be valid from now
      if (!social) {
        // User already exist, or just created above, merge with main account
        const socialResult = await addSocial({
          userId: userId!,
          socialId: id,
          provider: 1,
        });
      }
      return done(undefined, user as User);
    }
  )
);
