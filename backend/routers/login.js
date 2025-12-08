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
        res.status(404).json({
            success: false
        })
    }
});

rout.post("/create/:username/:password", (req, res) => {
    let userBool = userCreate(req.params.username, req.params.password);
    if(userBool) {
        res.send();
        console.log("User was created!");
    } else {
        console.log("There was a problem creating the user");
        res.send("There was a problem creating the user");
    }
    return userBool;
});
console.log(rout+"HIII");
export { rout };