// Imports
import express from 'express';
import { addTrack, returnTracks, returnTrack } from '../models/trackModel.js';

// Load api keys from .env
import env from '../config.js';
const client_id = env.spotifyClient;
const client_secret = env.spotifySecret;

const rout = express.Router();

rout.get("/getTrack/:trackID/:userID", async (req, res) => {
    try {
        const response = await getToken();
        let trackDetail = await getTrack(req.params.trackID, response.access_token);

        addTrack(req.params.userID,req.params.trackID,trackDetail.name,trackDetail.album.images[2].url,trackDetail.artists[0].name,trackDetail.artists[0].id);
        res.status(200).json({
            success: true
        });
    } catch(e) {
        res.status(404).json({
            success: false
        });
        throw new Error("An error occured while added the song: "+e);
    }
});

rout.get("/getTracks/:userID", async (req, res) => { // Returns list of tracks that have matching userID's in an array
    let trackArr = await returnTracks(req.params.userID);
    if(trackArr) {
        res.status(200).json({
            tracks: trackArr
        });
    } else {
        res.status(204).json({
            tracks: null
        });
    }
});

rout.get("/returnTrack/:userID/:trackID", async (req, res)=> {
    let trackout = await returnTrack(req.params.userID, req.params.trackID);
    if(trackout) {
        res.status(200).json({
            track: trackout
        });
    } else {
        res.status(204).json({
            track: null
        });
    }
});

// Both of the below functions were taken from https://github.com/spotify/web-api-examples/blob/master/authorization/client_credentials/app.js
async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
  });
  return await response.json();
}

async function getTrack(trackID, token) {
    const response = await fetch('https://api.spotify.com/v1/tracks/'+trackID, {
        method: "GET",
        headers: { "Authorization": "Bearer "+token }, 
    });
    return await response.json();
}

// Expose router object to server.js
export { rout };