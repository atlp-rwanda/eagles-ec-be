import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {env} from "../utils/env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_redirect_url,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  //@ts-ignore
  done(null, user);
});
