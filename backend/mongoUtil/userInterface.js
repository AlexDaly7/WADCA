import Mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const schema = {
    userID: String,
    username: String,
    password: String,
    dateCreated: Date
}

const userMod = Mongoose.model("users", schema);

async function userCreate(userIn, passIn) {
    console.log(await userMod.findOne({username: userIn}));
    if(await userMod.findOne({username: userIn})===null) {
        const userId = nanoid();
        const user = new userMod({
            userID: userId,
            username: userIn,
            password: passIn,
            dateCreated: Date()
        });
        await user.save();
        return userId;
    } else {
        console.log("There is already an account with that name");
        return 0;
    }
}

async function userLogin(user, pass) {
    try {
        return userMod.find({username:user, password:pass})
        .then((result)=>{
            console.log("data output: "+result);
            console.log("Result :",result[0].password+result[0].username);
            if(!result) { return null }
            console.log("Found"+result[0].userID);
            return result[0].userID;
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
            return true
        }).catch((e) => {
            return null;
        });
}

export {userCreate, userLogin}