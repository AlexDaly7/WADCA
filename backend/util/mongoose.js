import Mongoose from "mongoose";
const url = 'mongodb+srv://Alex:cLDomYFI1qMGVVtm@wadca.bvq9g1h.mongodb.net/?appName=WADCA';
let db;

async function connectDB() {
    try {
        db = Mongoose.connect(url);
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