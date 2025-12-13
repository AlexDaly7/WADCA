// Dotenv to read .env file and load api keys
import dotenv from "dotenv";

// Express initu
import express from "express";
const app = express();
const port = 3000;

// Import fs
import fs from "fs";

// Import function to connect to database
import { connectDB } from "./backend/util/mongoose.js";

// Router imports
const userRout = import("./backend/routers/user.js");
const trackRout = import("./backend/routers/track.js");
const profileRout = import("./backend/routers/profile.js");
const playlistRout = import("./backend/routers/playlist.js");

app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Init EJS

async function serverStart() { // Try to start the server
    try {
        await connectDB(); // Connect to database
        dotenv.config() // Load dotenv
        // Establish routers
        const user = await userRout; // Get routers
        const track = await trackRout;
        const profile = await profileRout;
        const playlist = await playlistRout;
        app.use("/track/", track.rout); // Assign routers to routes
        app.use("/user/", user.rout);
        app.use("/profile/", profile.rout);
        app.use("/playlist/", playlist.rout);

        app.use((req, res) => { // Init 404 page
            res.render("404", {request: toString(req)})
        });
        app.listen(port, () => {console.log(`Server running on https://localhost:${port}`)}); // Listen for requests
    } catch(e) {
        console.error("An error occured while starting the server: ", e); // If problem add to console
    }
}

// Index / Homepage route
app.get("/", (req, res) => {
    res.render("index");
});

// Login page route
app.get("/login", (req, res) => {
    res.render("login");
});

// Track route
app.get("/tracks", (req, res) => {
    res.render("tracks");
})

// Profile route
app.get("/profile", (req, res) => {
    res.render("myProfile");
});

// Visitor count routes
app.post("/newVisitor", (req, res) => { // Read visitors file and update it by one
    let visCount;
    fs.readFile("visitorCount.txt", "utf8", (err, data) => {
        visCount = parseInt(data);
        visCount++;
    
        fs.writeFile("visitorCount.txt", String(visCount), (err) => {
            console.log("Visitor count updated");
        });
    })
});
app.get("/getVisitors", (req, res) => { // Read visitor file and return the number
    fs.readFile("visitorCount.txt", "utf8", (err, data) => {
        const visCount = parseInt(data);
        res.send(visCount);
    })
});

serverStart(); // Try to start server.