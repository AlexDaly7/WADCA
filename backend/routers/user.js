import express from 'express';
let rout = express.Router();
import { userLogin, userCreate } from '../mongoUtil/userInterface.js';

// Login POST request
rout.get("/login/:username/:password", async (req, res) => {
    console.log(req.params.username+req.params.password);
    const response = await userLogin(req.params.username, req.params.password);
    if(response!=null) {
        res.status(200).json({
            userID: response
        });
    } else {
        res.status(204).json({
            userID: 0
        })
    }
});

rout.get("/auth/:userID", (req, res) => {

});

rout.get("/create/:username/:password", async (req, res) => {
    let user = await userCreate(req.params.username, req.params.password);
    console.log("user: "+user);
    if(user!=0) {
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