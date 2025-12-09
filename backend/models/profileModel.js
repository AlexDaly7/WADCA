import Mongoose from 'mongoose';

const schema = {
    userID: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    dateCreated: { type: Date, required: true }
}

const userMod = Mongoose.model("profiles", schema);