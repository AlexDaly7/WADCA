// Imports
import express from 'express';
import { getProfile, getPlaylists, addPlaylist, removePlaylist } from '../models/profileModel.js';
import { getPlaylist } from '../models/playlistModel.js';
import { returnTrack } from '../models/trackModel.js';

let rout = express.Router(); // Create router object

// Return a users profile page and pass users profile data in via EJS
rout.get("/user/:username", async (req, res)=> {
    const result = await getProfile(req.params.username); // Get profile info
    let playlistsList = [];
    if(result.playlists.length>0) {
        for(let i=0;i<result.playlists.length;i++) { // For each playlist
            let trackList = [];
            if(result.playlists[0].tracks!=undefined&&result.playlists[0].tracks.length) { // If playlist contains tracks and exists
                for(let j=0;j<result.playlists[i].tracks.length;j++) { // For each track
                    const track = await returnTrack(result.userID, result.playlists[i].tracks[j]);
                    let trackJson = { // Create track obj
                        name: track.trackName,
                        author: track.authorName,
                        img: track.trackImg
                    }
                    trackList.push(trackJson); // Tracks are put into an array
                }
                playlistsList.push({ // Track array is added to relevant playlist as it goes into an array
                    title: result.playlists[i].title,
                    tracks: trackList
                });
            }
        }
    }
    res.render("profile", { username: req.params.username, bio: result.bio, playlists: playlistsList}); // Page is sent to user with data required
});

// Get list of a users profile playlists for editing in playlist page, userID for verification of ownership
rout.get("/getPlaylists/:userID", async (req, res)=>{
    const result = await getPlaylists(req.params.userID);
    if(result!=null) {
        res.status(200).json({
            playlists: result.playlists
        });
    } else {
        res.sendStatus(204);
    }
});

// Add playlist to profile. Since a foreign key is used to populate it later, it requires playlists MongoDB _id
rout.post("/addPlaylist/:username/:title/:userID", async (req, res)=>{
    const result = await getPlaylist(req.params.username, req.params.title);
    const result1 = await addPlaylist(req.params.userID, result._id);
    if(result1) {
        res.status(200).json({
            success: true
        })
    } else {
        res.status(204).json({
            success: false
        })
    }
});

// Remove playlist from profile, must also get a playlists _id to identify playlist
rout.post("/removePlaylist/:username/:title/:userID", async (req, res)=>{
    const result = await getPlaylist(req.params.username, req.params.title);
    const result1 = await removePlaylist(req.params.userID, result._id);
    if(result1) {
        res.status(200).json({
            success: true
        })
    } else {
        res.status(204).json({
            success: false
        })
    }
});

// Expose router to server.js
export { rout };