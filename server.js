const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static("public"));
app.set("view engine", "ejs");

// Index
app.get("/", (req, res) => {
    res.render("index", {title:"Hello!"});
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
})

// 404 Page
app.use((req, res, next) => {
    res.render("404", {request: toString(req)})
});

app.listen(3000, () => {
    console.log("Server running on https://localhost:3000")
});