import express from 'express';
import { getProfile } from '../models/profileModel.js';

let rout = express.Router();
    
    rout.get("/:username", async (req, res)=> {
        const profile = await getProfile(req.params.username);
        res.render("profile", { username: req.params.username, bio: profile[0].bio})
    });

export { rout };