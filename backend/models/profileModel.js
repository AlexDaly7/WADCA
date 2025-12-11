import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
    playlists: [{ type: Mongoose.Schema.Types.ObjectId, ref: "playlists"}]  
}

const profileMod = Mongoose.model("profiles", schema);

async function createProfile(userIDin, usernamein) {
    const playlist = new profileMod({
        userID: userIDin,
        username: usernamein
    });
    playlist.save();
    return true;
}

async function getProfile(usernamein) {
    const profile = await profileMod.findOne({username:usernamein})
        .populate("playlists");
    if(profile!=null) {
        return profile;
    } else {
        return null;
    }
    
}

async function addPlaylist(userIDin, playlistID) {
    // new mongoose.Types.ObjectId() was a fix found on stackoverflow https://stackoverflow.com/a/77058999
    console.log("UserID: "+userIDin+"\nPlaylistID"+playlistID);
    const result = await profileMod.updateOne({userID: userIDin}, {$addToSet: {playlists: new Mongoose.Types.ObjectId(playlistID._id)}})
    if(result.modifiedCount!=0) {
        return true;
    } else {
        return false;
    }
}

async function removePlaylist(userIDin, playlistID) {
    // new mongoose.Types.ObjectId() was a fix found on stackoverflow https://stackoverflow.com/a/77058999
    const result = await profileMod.updateOne({userID: userIDin,}, {$pull: {playlists: playlistID}})
    if(result.modifiedCount!=0) {
        console.log(result);
        return true;
    } else {
        return false;
    }
}

async function getPlaylists(userIDin) {

}

export { createProfile, getProfile, getPlaylists, addPlaylist, removePlaylist }