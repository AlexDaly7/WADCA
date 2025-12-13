// Imports
import express from 'express';
import { createPlaylist, addTrack, removeTrack, getPlaylists } from '../models/playlistModel.js';

let rout = express.Router(); // Create router object

// Default playlists route
rout.get("/", (req, res) => {
    res.render("playlists");
});

// This route adds a playlist to the playlist collection
rout.post("/createPlaylist/:userID/:username/:title", async (req, res)=>{
    const result = await createPlaylist(req.params.userID, req.params.username, req.params.title);
    if(result) {
        res.status(200).json({
            success: true
        })
    } else {
        res.status(204).json({
            success: false
        })
    }
});

// This route returns all playlists associated with a given username
rout.get("/getPlaylists/:username", async (req, res)=>{
    const result = await getPlaylists(req.params.username);
    if(result.length!=0) {
        res.status(200).json({
            playlists: result
        });
    } else {
        res.sendStatus(204);
    }

})

// This route adds a trackID to a playlist with a given title and userID to verify ownership
rout.get("/addTrack/:trackID/:userID/:title", async (req, res)=>{
    const result = await addTrack(req.params.trackID, req.params.userID, req.params.title);
    if(result) {
        res.status(200).json({
            success: true
        });
    } else {
        res.status(204).json({
            success: false
        });
    }
});

// This route removes a track from a playlist with given userID and title
rout.get("/removeTrack/:trackID/:userID/:title", async (req, res)=>{
    const result = await removeTrack(req.params.trackID, req.params.userID, req.params.title);
    if(result) {
        res.status(200).json({
            success: true
        });
    } else {
        res.status(204).json({
            success: false
        });
    }
});

// Expose router object to server.js
export { rout };