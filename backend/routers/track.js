import express from 'express';
import { addTrack, returnTracks } from '../models/trackModel.js';
let rout = express.Router();

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
    try {
        console.log("getTracks");
        let trackArr = await returnTracks(req.params.userID);
        res.status(200).json({
            tracks: trackArr
        });
    } catch(e) {
        res.status(204).json({
            tracks: null
        });
        throw new Error("An error occured while fetching songs: "+e);
    }
});

var client_id = '514266725d9e497d82961f957d9e60f4';
var client_secret = 'b066e0ea58dc40cfb319cd5b95d37b3a';

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


export { rout };