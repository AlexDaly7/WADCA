async function updateVisitors() {
    if(!localStorage.visited) {
        console.log("New visitor detected, marking as viewed.")
        localStorage.setItem("visited", true);
        await fetch("/newVisitor", {method: "POST"}).then(response => response.text());
    } else {
        console.log("Visitor is not new");
    }
}
async function getVisitors() {
    await fetch("/getVisitors", {method: "GET"}).then(response => response.text())
    .then(data => {
        document.getElementById("visitors").innerHTML = String(data);
    });
}

export {updateVisitors, getVisitors};