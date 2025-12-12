import express from 'express'; // Imports 
let rout = express.Router();
import { userLogin, userCreate, userSearch } from '../models/userModel.js';

// Login user route
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

rout.get("/search/:terms", async (req, res) => {
        let searchResults = await userSearch(req.params.terms);
        console.log("searchResuots: "+searchResults)
        if(searchResults.length!=0) {
            res.status(200).json({
                results: searchResults
            });
        } else {
            res.sendStatus(204);
        }
});

// Create user route
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
export { rout };