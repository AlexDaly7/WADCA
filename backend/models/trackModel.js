import Mongoose from 'mongoose'; // Imports

const trackMod = Mongoose.model("tracks", { // Set schema and init model
    userID: { type: String, required: true },
    trackID: { type: String, required: true},
    trackName: { type: String, required: true},
    trackImg: { type: String, required: true},
    authorName: { type: String, required: true},
    authorID: { type: String, required: true}
});

// Add track document to database
async function addTrack(userIDin, trackIDin, trackNamein, trackImgin, authorNamein, authorIDin) {
    // Check if user has already registered this trackID
    const userIDcheck = await trackMod.find({ userID: userIDin, trackID: trackIDin});
    if(userIDcheck.length===0) { // If not
        const track = new trackMod ({ // Create document object
            userID: userIDin,
            trackID: trackIDin,
            trackName: trackNamein,
            trackImg: trackImgin,
            authorName: authorNamein,
            authorID: authorIDin
        });
        await track.save(); // Save to database
        return true;
    } else {
        return false;
    }
   
}

// Get all tracks with userID
async function returnTracks(userIDin) {
    // Find all track documents with matching userID
    const result = await trackMod.find({ userID: userIDin });
    if(result.length!==0) { // Return if found
        return result;
    } else {
        return null;
    }
}

// Get a single track with userID
async function returnTrack(userIDin, trackIDin) {
    // Find document with matching userID and trackID, then return ID, name,img url and author name
    const result = await trackMod.findOne({ userID: userIDin, trackID: trackIDin }, "trackID trackName trackImg authorName");
    if(result) { // Return if found
        return result;
    } else {
        return null;
    }
}

// Expose functions to router files
export { addTrack, returnTracks, returnTrack }