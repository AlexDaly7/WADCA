let tracks = []; // List of up to date tracks

window.addEventListener("load", () => { // Adds event listener to track search button and loads/displays users tracks
    const formbtn = document.getElementById("trackbtn");
    const trackInput = document.getElementById("trackInput");
    formbtn.addEventListener("click", async () => {
        const userID = localStorage.getItem("userID");
        const trackID = trackInput.value.substring(31, 53);
        const response = await fetch("/track/getTrack/"+trackID+"/"+userID, { method: "POST"})
        if(response.status===200){ // If found update tracks
            console.log("Track has been added.");
            getTracks();
        } else if(response.status===204){
            console.log("Track has not been added.");
        }
    })
    getTracks();
});

// Must be in seperate func to make async.
async function getTracks() { // Gets tracks from fetch request and calls function to display them.
    if(localStorage.getItem("userID")) {
        const userID = localStorage.getItem("userID");
        let response = await fetch("/track/getTracks/"+userID, { method: "GET" })
        response = await response.json();
        tracks = response.tracks;
        displayTracks();
    }
}

// Deletes old tracks from list and populates the list with update tracks
async function displayTracks() {
    if(tracks.length!=0) {
        const wrapper = document.getElementById("trackList");
        const trackList = document.getElementsByClassName("trackEntry");
        for(let i=0;i<trackList.length;) { // Clear old list
            trackList[i].remove();
        }
        tracks.reverse();
        tracks.forEach((track) => { // Create li element for each track in list and fill with info
            const trackItem = document.createElement("li");
            trackItem.classList.add("trackEntry")
            const img = document.createElement("img");
            img.src=track.trackImg;
            const name = document.createElement("h2");
            name.append(document.createTextNode(track.trackName)); 
            const artist = document.createElement("p");
            artist.append(document.createTextNode(track.authorName))
            trackItem.append(name);
            trackItem.append(artist);
            trackItem.append(img);
            wrapper.append(trackItem);
        })
    }   
}