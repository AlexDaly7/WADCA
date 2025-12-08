// Express init
const express = require("express");
const app = express();
const port = 3000;

// Router imports
const loginRout = import("./backend/routers/login.js");

const fs = require("fs");
const { connectDB } = require("./util/mongodb.js");
const { userCreateCol, userCreate, userLogin } = require("./backend/mongoUtil/userInterface.js")

app.use(express.static("public"));
app.set("view engine", "ejs");

async function serverStart() {
    try {
        await connectDB();
        const login = await loginRout;
        app.use("/login/", login.rout);

        app.use((req, res, next) => {
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

app.get("/test", (req, res) => {
    res.render("login");
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
