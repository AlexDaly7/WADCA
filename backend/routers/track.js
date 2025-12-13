// Imports
import express from 'express';
import { addTrack, returnTracks, returnTrack } from '../models/trackModel.js';

// Load api keys from .env
import env from '../config.js';
const client_id = env.spotifyClient;
const client_secret = env.spotifySecret;

const rout = express.Router(); // Create router object

// Get Spotify access token and use it to retrieve track data, Save data to database
rout.post("/getTrack/:trackID/:userID", async (req, res) => {
    const response = await getToken(); // Get access token
    let trackDetail = await getTrack(req.params.trackID, response.access_token); // Get track

    addTrack(req.params.userID,req.params.trackID,trackDetail.name,trackDetail.album.images[2].url,trackDetail.artists[0].name,trackDetail.artists[0].id);
    if(addTrack){res.sendStatus(200)}
    else{res.sendStatus(204)}
});

// Return list of tracks that have matching userID's in an array
rout.get("/getTracks/:userID", async (req, res) => { 
    let trackArr = await returnTracks(req.params.userID);
    if(trackArr) {
        res.status(200).json({
            tracks: trackArr
        });
    } else {res.sendStatus(204);}
});

// Return a single track
rout.get("/returnTrack/:userID/:trackID", async (req, res)=> {
    let trackout = await returnTrack(req.params.userID, req.params.trackID);
    if(trackout) {
        res.status(200).json({
            track: trackout
        });
    } else {res.sendStatus(204)}
});

// Both of the below functions were taken from https://github.com/spotify/web-api-examples/blob/master/authorization/client_credentials/app.js
// Gets an access token from spotify, necessary for interacting with the API
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
// Gets track information using a trackID and the access token
async function getTrack(trackID, token) {
    const response = await fetch('https://api.spotify.com/v1/tracks/'+trackID, {
        method: "GET",
        headers: { "Authorization": "Bearer "+token }, 
    });
    return await response.json();
}

// Expose router object to server.js
export { rout };