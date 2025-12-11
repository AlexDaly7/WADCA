import express from 'express';
import { getProfile, getPlaylists, addPlaylist, removePlaylist } from '../models/profileModel.js';
import { getPlaylist } from '../models/playlistModel.js';
import { returnTrack } from '../models/trackModel.js';

let rout = express.Router();
    
    rout.get("/user/:username", async (req, res)=> {
        const result = await getProfile(req.params.username);
        let playlistsList = [];
        if(result.playlists.length>0) {
            for(let i=0;i<result.playlists.length;i++) {
                let trackList = [];
                if(result.playlists[0].tracks!=undefined&&result.playlists[0].tracks.length) {
                    console.log(result.playlists[i].tracks)
                    for(let j=0;j<result.playlists[i].tracks.length;j++) {
                        
                        const track = await returnTrack(result.userID, result.playlists[i].tracks[j]);
                        console.log("TRACK:"+track)
                        let trackJson = {
                            name: track.trackName,
                            author: track.authorName,
                            img: track.trackImg
                        }
                        trackList.push(trackJson);
                    }
                    console.log(trackList)
                    playlistsList.push({
                        title: result.playlists[i].title,
                        tracks: trackList
                    });
                }
            }
        }
        console.log(playlistsList)
        res.render("profile", { username: req.params.username, bio: result.bio, playlists: playlistsList})
    });

    rout.get("/getPlaylists/:userID", async (req, res)=>{
        const result = await getPlaylists(req.params.userID);
        console.log(result.playlists)
        if(result!=null) {
            res.status(200).json({
                playlists: result.playlists
            });
        } else {
            res.status(204)
        }
    });

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
    rout.post("/removePlaylist/:username/:title/:userID", async (req, res)=>{
        const result = await getPlaylist(req.params.username, req.params.title);
        const result1 = await removePlaylist(req.params.userID, result._id);
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