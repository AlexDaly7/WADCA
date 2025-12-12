import Mongoose from 'mongoose'; // Imports

const profileMod = Mongoose.model("profiles", { // Set schema and init model
    userID: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    playlists: [{ type: Mongoose.Schema.Types.ObjectId, ref: "playlists"}] // Stores playlist document reference _ids  
});

// Add new profile document
async function createProfile(userIDin, usernamein) {
    // Create new document object
    const profile = new profileMod({ // No search for validation is required as profiles are tied to userIDs and usernames 
        userID: userIDin,
        username: usernamein
    });
    profile.save(); // Save profile to database
    return true;
}

// Get profile data for rendering page
async function getProfile(usernamein) {
    // Find document with matching username and return data
    const result = await profileMod.findOne({username:usernamein}, "userID bio playlists")
        .populate("playlists", "title tracks"); // Join the playlist collection and populate playlists field with titles and tracks for the user
    if(result!=null) { // Return if found
        return result;
    } else {
        return null;
    }
    
}

// Add playlist _id object to document
async function addPlaylist(userIDin, playlistID) {
    // new mongoose.Types.ObjectId() was a fix found on stackoverflow https://stackoverflow.com/a/77058999
    // Find document with matching userID and add playlist _id object to playlists array 
    const result = await profileMod.updateOne({userID: userIDin}, {$addToSet: {playlists: new Mongoose.Types.ObjectId(playlistID._id)}});
    if(result.modifiedCount!=0) { // Return true if modified
        return true;
    } else {
        return false;
    }
}

// Remove playlist _id object from document
async function removePlaylist(userIDin, playlistID) {
    // new mongoose.Types.ObjectId() was a fix found on stackoverflow https://stackoverflow.com/a/77058999
    // Find document with matching userID and remove playlist _id object from playlists array 
    const result = await profileMod.updateOne({userID: userIDin}, {$pull: {playlists: new Mongoose.Types.ObjectId(playlistID._id)}});
    if(result.modifiedCount!=0) { // Return true if modified
        return true;
    } else {
        return false;
    }
}

// Get list of playlist titles
async function getPlaylists(userIDin) {
    // Find document with matching userID and return playlists
    const result = await profileMod.findOne({userID: userIDin}, "playlists")
        .populate("playlists", "username title"); // Join the playlist collection and populate playlists field with titles and tracks for the user
    if(result!=null) { // Return if found
        return result;
    } else {
        return null;
    }
}

// Expose functions to router files
export { createProfile, getProfile, getPlaylists, addPlaylist, removePlaylist }