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
            await fetch("/track/getTrack/"+trackID+"/"+userID, { method: "GET"})
                .then(response => {
                    response = response.json();
                    console.log(response);
                    getTracks();
                });
        } else {

        }
    })
    getTracks();
});

// Must be in seperate func to make async.
async function getTracks() {
    if(localStorage.getItem("userID")) {
        const userID = localStorage.getItem("userID");
        await fetch("/track/getTracks/"+userID, { method: "GET" })
            .then(async response=>{
                response = await response.json();
                tracks = response.tracks;
                console.log("Songs loaded");
                displayTracks();
            });
    }
}

async function displayTracks() {
    if(tracks.length!=0) {
    const wrapper = document.getElementById("trackList");
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