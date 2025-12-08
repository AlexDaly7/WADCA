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
    let coll = Mongoose.model("users",schema);
    let userCount = parseInt(coll.countDocuments());
    if(coll.findOne({username: userIn})) {
        const user = new coll({
            userID: nanoid(),
            username: userIn,
            password: passIn,
            dateCreated: Date()
        });
        await user.save();
        return true;
    } else {
        console.log("There is already an account with that name");
        return false;
    }
}

async function userLogin(user, pass) {
    try {
        return userMod.findOne({username:user, password:pass})
        .then((data)=>{
            if(data) {
                console.log("Result :",data.password);
                if(!data) { return null }
                console.log("Found"+data.userID);
                return data.userID;
            } else {
                return null;
            }
        });
    } catch(e) {
        throw new Error("An error has occured while logging in: "+e);
    }
}

export {userCreate, userLogin}