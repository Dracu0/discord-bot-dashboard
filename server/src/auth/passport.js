const DiscordStrategy = require('passport-discord').Strategy;

const SCOPES = ['identify', 'guilds'];

function configurePassport(passport, { clientID, clientSecret, callbackURL }) {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new DiscordStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
            scope: SCOPES,
        },
        (accessToken, refreshToken, profile, done) => {
            // Store tokens with the profile for API calls
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return done(null, profile);
        }
    ));
}

module.exports = configurePassport;
