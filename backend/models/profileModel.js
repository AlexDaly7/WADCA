import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true },
    bio: { type: String },
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
    return await profileMod.find({username:usernamein}, "username bio")
        .then((result)=>{
            console.log("umm..."+result);
            if(result) {
                return result;
            }
        });
}

export { createProfile, getProfile }