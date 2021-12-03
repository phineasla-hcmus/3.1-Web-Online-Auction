import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";

const LocalStrategy = passportLocal.Strategy;


passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    // User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
});

/**
 * Sign in using Email and Password.
 */
 passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: UserDocument) => {
    //     if (err) { return done(err); }
    //     if (!user) {
    //         return done(undefined, false, { message: `Email ${email} not found.` });
    //     }
    //     user.comparePassword(password, (err: Error, isMatch: boolean) => {
    //         if (err) { return done(err); }
    //         if (isMatch) {
    //             return done(undefined, user);
    //         }
    //         return done(undefined, false, { message: "Invalid email or password." });
    //     });
    // });
}));
