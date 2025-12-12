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




app.use(express.static("public"));
app.set("view engine", "ejs");

async function serverStart() {
    try {
        await connectDB(); // Connect to database
        dotenv.config() // Load dotenv
        // Establish routers
        const user = await userRout; 
        const track = await trackRout;
        const profile = await profileRout;
        const playlist = await playlistRout;
        app.use("/track/", track.rout);
        app.use("/user/", user.rout);
        app.use("/profile/", profile.rout);
        app.use("/playlist/", playlist.rout);

        app.use((req, res) => {
            res.render("404", {request: toString(req)})
        });

        app.listen(port, () => {console.log(`Server running on https://localhost:${port}`)});
    } catch(e) {
        console.error("An error occured while starting the server: ", e);
    }
}

// Index
app.get("/", (req, res) => {
    res.render("index", {title:"Hello!"});
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/tracks", (req, res) => {
    res.render("tracks");
})

app.get("/profile", (req, res) => {
    res.render("myProfile");
});

app.post("/newVisitor", (req, res) => {
    let visCount;
    fs.readFile("visitorCount.txt", "utf8", (err, data) => {
        visCount = parseInt(data);
        visCount++;
    
        fs.writeFile("visitorCount.txt", String(visCount), (err) => {
            console.log("Visitor count updated");
        });
    })
});
app.get("/getVisitors", (req, res) => {
    fs.readFile("visitorCount.txt", "utf8", (err, data) => {
        const visCount = parseInt(data);
        res.send(visCount);
    })
});

serverStart();

// 404 Page
