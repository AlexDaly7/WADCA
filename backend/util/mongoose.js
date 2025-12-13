import Mongoose from "mongoose"; // Imports
import env from '../config.js';

// Connect to database using URI from .env file.
async function connectDB() {
    try {
        console.log(env.mongooseUri);
        const db = Mongoose.connect(env.mongooseUri);
        console.log("The database has been connected successfully");
    } catch(e) {
        console.log("There was a problem connecting to database: "+e);
    }
}
export {connectDB}; 