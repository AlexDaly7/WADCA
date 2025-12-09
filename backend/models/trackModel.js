import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    trackID: { type: String, required: true},
    trackName: { type: String, required: true},
    trackImg: { type: String, required: true},
    authorName: { type: String, required: true},
    authorID: { type: String, required: true}
}

const trackMod = Mongoose.model("tracks", schema);

async function addTrack(userIDin, trackIDin, trackNamein, trackImgin, authorNamein, authorIDin) {
    let userIDcheck = await trackMod.find({ userID: userIDin, trackID: trackIDin});
    if(userIDcheck.length===0) {
        const track = new trackMod ({
            userID: userIDin,
            trackID: trackIDin,
            trackName: trackNamein,
            trackImg: trackImgin,
            authorName: authorNamein,
            authorID: authorIDin
        });
        await track.save();
        return true;
    } else {
        return false;
    }
    
}

async function returnTracks(userIDin) {
    return trackMod.find({ userID: userIDin })
        .then(result=>{
            return result;
        }).catch((e)=>{
            console.log("Problem...");
        });
}

export { addTrack, returnTracks }