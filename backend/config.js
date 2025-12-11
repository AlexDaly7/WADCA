// Implementation of config file was gotten from https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
import dotenv from "dotenv";
dotenv.config();
export default {
    mongooseUri: process.env.MONGOOSE_URL,
    spotifyClient: process.env.SPOTIFY_CLIENT,
    spotifySecret: process.env.SPOTIFY_SECRET
}

