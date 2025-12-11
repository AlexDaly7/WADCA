let authKey;
let tracks = [];

window.addEventListener("load", () => { // Adds event listener to track search button and loads/displays users tracks
    const formbtn = document.getElementById("trackbtn");
    const trackInput = document.getElementById("trackInput");
    formbtn.addEventListener("click", async () => {
        if(localStorage.getItem("userID")) {
            const userID = localStorage.getItem("userID");
            const trackID = trackInput.value.substring(31, 53);
            console.log("HJELP"+trackID);
            const response = await fetch("/track/getTrack/"+trackID+"/"+userID, { method: "GET"})
            if(response.status===200){
                console.log("Track has been added.");
            } else {
                console.log("Track has not been added.")
            }
        } else {

        }
    })
    getTracks();
});

// Must be in seperate func to make async.
async function getTracks() { // Gets tracks from fetch request and calls function to display them.
    if(localStorage.getItem("userID")) {
        const userID = localStorage.getItem("userID");
        await fetch("/track/getTracks/"+userID, { method: "GET" })
            .then(async response=>{
                response = await response.json();
                tracks = response.tracks;
                console.log("Tracks loaded");
                displayTracks();
            });
    }
}

async function displayTracks() { // Deletes old tracks from list and populates the list with update tracks
    if(tracks.length!=0) {
    const wrapper = document.getElementById("trackList");
    const trackList = document.getElementsByClassName("trackEntry");
    for(let i=0;i<trackList.length;) {
        trackList[i].remove();
    }
    tracks.reverse();
    tracks.forEach((track) => {
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