import Mongoose from "mongoose";
import env from '../config.js';

async function connectDB() {
    try {
        console.log(env.mongooseUri);
        db = Mongoose.connect(env.mongooseUri);
        console.log("The database has been connected successfully");
    } catch(e) {
        console.log("There was a problem connecting to database: "+e);
    }
}

async function closeDB() {
    if(!db) {
        console.log("The database is not connected");
    } else {
        db.close();
    }
}
export {connectDB, closeDB}; 