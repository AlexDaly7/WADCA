// Imports
import Mongoose from 'mongoose';
import { createProfile } from './profileModel.js';
import { nanoid } from 'nanoid';

const userMod = Mongoose.model("users", { // Set schema and init model
    userID: { type: String, required: true },
    username: { type: String, required: true, min: 5, max: 40},
    password: { type: String, required: true, min: 5, max: 40},
    dateCreated: { type: Date, required: true }
});

// Create user document
async function userCreate(userIn, passIn) {
    // If no user document is found with the same username
    if(await userMod.findOne({username: userIn})===null) {
        const userIDin = nanoid(); // Generate userID with nanoid package
        const user = new userMod({ // Create document object
            userID: userIDin,
            username: userIn,
            password: passIn,
            dateCreated: Date()
        });
        await user.save(); // Save document to database
        createProfile(userIDin, userIn); // Create profile for user
        return userIDin;
    } else {
        return null;
    }
}

// Find document with matching username and password
async function userLogin(user, pass) {
    // Find document with matching user and pass
    const result = await userMod.findOne({username:user, password:pass}, "userID");
    console.log(result)
    if (result!=null) { // Return if true
        return result;
    } else {
        return false;
    }
}

// Search for username using regex expression for search results
// Regex implementation below gotten from https://stackoverflow.com/a/63435547
async function userSearch(searchTerms) {  // Uses regex expression to search and return usernames.
    const regex = new RegExp(searchTerms, "i"); // Create regex object
    const result = userMod.find({username: {$regex: regex}}, "username").limit(2) // Find
    if(result.length!==0) {
        return result;
    }
}

// Expose functions to routers
export {userCreate, userLogin, userSearch}