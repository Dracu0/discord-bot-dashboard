const OAuth2Strategy = require('passport-oauth2');

const SCOPES = ['identify', 'guilds'];
const DISCORD_API = 'https://discord.com/api/v10';

function configurePassport(passport, { clientID, clientSecret, callbackURL }) {
    passport.serializeUser((user, done) => {
        done(null, {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar,
            banner: user.banner || null,
            accent_color: user.accent_color || null,
            guilds: user.guilds,
            _accessToken: user._accessToken || null,
            _guildsRefreshedAt: Date.now(),
        });
    });
    passport.deserializeUser((obj, done) => done(null, obj));

    const strategy = new OAuth2Strategy(
        {
            authorizationURL: `${DISCORD_API}/oauth2/authorize`,
            tokenURL: `${DISCORD_API}/oauth2/token`,
            clientID,
            clientSecret,
            callbackURL,
            scope: SCOPES.join(' '),
        },
        async (accessToken, refreshToken, params, _profile, done) => {
            try {
                // Fetch user profile from Discord API
                const userRes = await fetch(`${DISCORD_API}/users/@me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!userRes.ok) {
                    return done(new Error(`Discord user fetch failed: ${userRes.status}`));
                }
                const user = await userRes.json();

                // Fetch user's guilds
                const guildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!guildsRes.ok) {
                    return done(new Error(`Discord guilds fetch failed: ${guildsRes.status}`));
                }
                const guilds = await guildsRes.json();

                user.guilds = guilds;
                user._accessToken = accessToken;
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    );

    // passport-oauth2 needs this to handle the profile step
    strategy.userProfile = function (accessToken, done) {
        done(null, {});
    };

    passport.use('discord', strategy);
}

module.exports = configurePassport;
