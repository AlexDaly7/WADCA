import Mongoose from 'mongoose'; // Imports

const playlistMod = Mongoose.model("playlists", { // Set schema and init model
    userID: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, require: true },
    tracks: { type: [String] }
});

// Add new playlist document
async function createPlaylist(userIDin, usernamein, titlein) {
    const titleCheck = await playlistMod.find({ title: titlein }); // Search database for records matching title
    if(titleCheck.length===0) { // If no records have the same title
        const playlist = new playlistMod({ // Make document object with passed in information
            userID: userIDin,
            username: usernamein,
            title: titlein
        });
        playlist.save(); // Save document to database
        return true;
    } else {
        return false;
    }
}
// Adds track document to playlist with matching userID and title
async function addTrack(trackID, userIDin, titlein) { 
    // Finds document that has the title and userID (to verify ownership)passed in and adds a trackID to the tracks array
    const result = await playlistMod.updateOne({userID: userIDin, title: titlein}, {$addToSet: {tracks: [trackID]}})
    if(result.modifiedCount!=0) { // Check if result has modified document
        return true;
    } else {
        return false;
    }
}
// Removes trackID from playlist document
async function removeTrack(trackID, userIDin, titlein) {
    // Finds document with matching userID (to verify ownership) and track and removes the track from the array
    const result = await playlistMod.updateOne({userID: userIDin, title: titlein}, {$pull: {tracks: trackID}})
    if(result.modifiedCount!=0) { // Check if result has modified document
        return true;
    } else {
        return false;
    }
}

// Get playlist document mongodb _id
async function getPlaylist(usernamein, titlein) {
        // Finds document with matching username and title and returns the _id
        const result = await playlistMod.findOne({ username: usernamein, title: titlein }, "_id")
        if(result) { // Return result if true
            return result;
        } else {
            return null;
        }
}

// Get list of playlists with matching username
async function getPlaylists(usernamein) {
        const result = await playlistMod.find({ username: usernamein }) // Get matching documents
        if(result) { // Return result if true
            return result;
        } else {
            return null;
        }
}       

// Expose functions to router files
export { createPlaylist, addTrack, removeTrack, getPlaylists, getPlaylist }