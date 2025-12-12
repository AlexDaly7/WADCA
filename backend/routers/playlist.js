import express from 'express';
import { createPlaylist, addTrack, removeTrack, getPlaylists } from '../models/playlistModel.js';

let rout = express.Router();
    
rout.get("/", (req, res) => {
    res.render("playlists");
});

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

rout.get("/getPlaylists/:username", async (req, res)=>{
    const result = await getPlaylists(req.params.username);
    console.log(result);
    if(result.length!==0) {
        res.status(200).json({
            playlists: result
        });
    } else {
        res.sendStatus(204);
    }

})

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
export { rout };