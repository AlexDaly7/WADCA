import express from 'express'; // Imports 
let rout = express.Router();
import { userLogin, userCreate, userSearch } from '../models/userModel.js';

// Login user route
rout.get("/login/:username/:password", async (req, res) => {
    console.log(req.params.username+req.params.password);
    const response = await userLogin(req.params.username, req.params.password);
    if(response!=null) {
        res.status(200).json({ 
            userID: response.userID,
            username: response.username
        });
    } else {
        res.status(204).json({
            userID: 0
        })
    }
});

rout.get("/search/:terms", async (req, res) => {
    try {
        let searchResults = await userSearch(req.params.terms);
        console.log("searchResuots: "+searchResults)
        res.status(200).json({
            results: searchResults
        });
    } catch(e) {
        throw new Error("Something went wrong requesting search results: "+e);
    }
});

// Create user route
rout.get("/create/:username/:password", async (req, res) => {
    let user = await userCreate(req.params.username, req.params.password);
    console.log("user: "+user);
    if(user!=null) {
        res.status(200).json({
            userID: user 
        })
    } else {
        console.log("There was a problem creating the user");
        res.status(204).json({
            userID: 0
        });
    }
});
export { rout };