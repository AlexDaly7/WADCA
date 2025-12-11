import express from 'express';
import { getProfile, getPlaylists, addPlaylist, removePlaylist } from '../models/profileModel.js';
import { getPlaylist } from '../models/playlistModel.js';

let rout = express.Router();
    
    rout.get("/user/:username", async (req, res)=> {
        const result = await getProfile(req.params.username);
        console.log(result);
        res.render("profile", { username: req.params.username, bio: result.bio})
    });

    rout.get("/getPlaylists/:userID", async (req, res)=>{
        const result = await getPlaylists(req.params.userID);

    });

    rout.post("/addPlaylist/:username/:title/:userID", async (req, res)=>{
        const result = await getPlaylist(req.params.username, req.params.title);
        const result1 = await addPlaylist(result._id, req.params.userID);
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
    rout.post("/removePlaylist/:username/:title/:userID", async (req, res)=>{
        const result = await getPlaylist(req.params.username, req.params.title);
        const result1 = await removePlaylist(result._id, req.params.userID);
        console.log(result1);
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

export { rout };