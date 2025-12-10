import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, require: true },
    desc: { type: String, required: true },
    tracks: { type: [String] }
}

const playlistMod = Mongoose.model("profiles", schema);

async function createPlaylist(userIDin, usernamein, titlein, descin) {
    const titleCheck = await playlistMod.find({ title: titlein });
    if(titleCheck.length===0) {
        const playlist = new playlistMod({
            userID: userIDin,
            username: usernamein,
            title: titlein,
            desc: descin
        });
        return true;
    } else {
        return false;
    }
}

async function addTrack(trackID, userIDin) {
    await playlistMod.updateOne({userID: userIDin},
        { $addToSet: {tracks: [trackID]}}, (e)=>{
        if(e){
            throw new Error("A problem has occured adding a song to a playlist: "+e);
        } else {
            console.log("Added song to playlist");
        }
    });
}

async function getPlaylist(usernamein) {
        await playlistMod.find({ username: usernamein})
            .then((result)=>{
                console.log(result);
            });
}

