const DiscordStrategy = require('passport-discord').Strategy;

const SCOPES = ['identify', 'guilds'];

function configurePassport(passport, { clientID, clientSecret, callbackURL }) {
    passport.serializeUser((user, done) => {
        // Only store safe, non-sensitive fields in the session — never tokens
        done(null, {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar,
            banner: user.banner || null,
            accent_color: user.accent_color || null,
            guilds: user.guilds,
        });
    });
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new DiscordStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
            scope: SCOPES,
        },
        (accessToken, refreshToken, profile, done) => {
            // Do not store tokens — they are not needed after login
            return done(null, profile);
        }
    ));
}

module.exports = configurePassport;
