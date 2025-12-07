// Imports
const MongoClient = import("mongodb").MongoClient;
// DB variable
let db;

async function connectDB() {
    // MongoDB variables
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url);
    const dbName = "WADCA";

    //MongoDB connection
    client.connect()
        .then(() => {
            console.log("MongoDB connection made");
            db = client.db(dbName);
        });
    return db
}

async function getDB() {
    if(!db) {
        throw new Error("The database has not been connected");
    } else {
        return db;
    }
}
export {getDB,connectDB};