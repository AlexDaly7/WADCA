import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, require: true },
    tracks: { type: [String] }
}

const playlistMod = Mongoose.model("playlists", schema);

async function createPlaylist(userIDin, usernamein, titlein) {
    const titleCheck = await playlistMod.find({ title: titlein });
    if(titleCheck.length===0) {
        const playlist = new playlistMod({
            userID: userIDin,
            username: usernamein,
            title: titlein
        });
        playlist.save();
        return true;
    } else {
        return false;
    }
}

async function addTrack(trackID, userIDin, titlein) { // Adds track to playlist with matching userID and title
    const result = await playlistMod.updateOne({userID: userIDin, title: titlein}, {$addToSet: {tracks: [trackID]}})
    if(result.modifiedCount!=0) {
        console.log(result);
        return true;
    } else {
        return false;
    }
}

async function removeTrack(trackID, userIDin, titlein) { // Removes track to playlist with matching userID and title
    console.log("userID: "+userIDin+"\nTitle: "+titlein+"\ntrackID: "+trackID);
    const result = await playlistMod.updateOne({userID: userIDin, title: titlein}, {$pull: {tracks: trackID}})
    console.log(result)
    if(result.modifiedCount!=0) {
        return true;
    } else {
        return false;
    }
}

async function getPlaylist(usernamein, titlein) {
        const result = await playlistMod.findOne({ username: usernamein, title: titlein }, "_id")
        console.log("_id"+result)
        if(result) {
            return result;
        } else {
            return null;
        }
}

async function getPlaylists(usernamein) {
        const result = await playlistMod.find({ username: usernamein })
        if(result) {
            return result;
        } else {
            return null;
        }
}       

export { createPlaylist, addTrack, removeTrack, getPlaylists, getPlaylist }