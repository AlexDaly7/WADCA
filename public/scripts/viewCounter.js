async function updateVisitors() { // Updates visitor number and marks user as visited in localStorage
    if(!localStorage.visited) {
        console.log("New visitor detected, marking as viewed.")
        localStorage.setItem("visited", true);
        await fetch("/newVisitor", {method: "POST"}).then(response => response.text());
    } else {
        console.log("Visitor is not new");
    }
}
async function getVisitors() { // Gets number of visitors so far and displays it
    let response = await fetch("/getVisitors", {method: "GET"}).then(response => response.text())
    document.getElementById("visitors").innerHTML = String(response);
}

// Export functions to footer.ejs
export {updateVisitors, getVisitors};