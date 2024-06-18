const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mongoURI: process.env.MONGO_URL,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
    sessionSecret: process.env.SESSION_SECRET,
    port: process.env.PORT || 8080
};
