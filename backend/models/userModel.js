import Mongoose from 'mongoose';
import { createProfile } from './profileModel.js';
import { nanoid } from 'nanoid';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true, min: 5, max: 40},
    password: { type: String, required: true, min: 5, max: 40},
    dateCreated: { type: Date, required: true }
}

const userMod = Mongoose.model("users", schema);

async function userCreate(userIn, passIn) {
    if(await userMod.findOne({username: userIn})===null) {
        const userIDin = nanoid();
        const user = new userMod({
            userID: userIDin,
            username: userIn,
            password: passIn,
            dateCreated: Date()
        });
        await user.save();
        createProfile(userIDin, userIn);
        return userIDin;
    } else {
        console.log("There is already an account with that name");
        return 0;
    }
}

async function userLogin(user, pass) {
    try {
        return userMod.find({username:user, password:pass})
            .then((result)=>{
                if(!result) { return null }
                return { userID: result[0].userID, username: result[0].username };
            }).catch(e => {
                return null;
            });
    } catch(e) {
        throw new Error("An error has occured while logging in: "+e);
    }
}

async function userAuth(userId) {
    return userMod.find({userID: userId})
        .then((result) => {
            return true;
        }).catch((e) => {
            return false;
        });
}
//Regex implementation below gotten from https://stackoverflow.com/a/63435547
async function userSearch(searchTerms) {  // Uses regex expression to search and return usernames.
    const regex = new RegExp(searchTerms, "i");
    return userMod.find({username: {$regex: regex}}, "username").limit(2)
        .then((result)=>{
            return result;
        })
}

export {userCreate, userLogin, userSearch}