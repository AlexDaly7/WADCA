import express from 'express'; // Imports 
let rout = express.Router();
import { userLogin, userCreate, userSearch } from '../models/userModel.js';

// Checks inputted user details against ones in database, if matching return userID and username
rout.get("/login/:username/:password", async (req, res) => {
    let response = await userLogin(req.params.username, req.params.password);
    console.log(response);
    if(response!=false) {
        res.status(200).json({ 
            userID: response.userID,
            username: response.username
        });
    } else {
        res.sendStatus(204);
    }
});

// Search the users for results matching the input and return them for searchBar
rout.get("/search/:terms", async (req, res) => {
        let searchResults = await userSearch(req.params.terms);
        if(searchResults.length!=0) {
            res.status(200).json({
                results: searchResults
            });
        } else {
            res.sendStatus(204);
        }
});

// Create user document with passed in values
rout.post("/create/:username/:password", async (req, res) => {
    let user = await userCreate(req.params.username, req.params.password);
    if(user!=null) {
        res.status(200).json({
            userID: user
        });
    } else {
        res.sendStatus(204);
    }
});
// Expose router to server.js
export { rout };