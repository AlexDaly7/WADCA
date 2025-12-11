let currentPlaylists;

window.addEventListener("load",async ()=>{ // Queues events to happen when the window loads
    currentPlaylists = await getPlaylists();
    addPlaylistBtn();
    populateDropdown();
    getTracks();
    displayPlaylist();
    setupProfileBtns();
});

async function addPlaylistBtn() {
    const output = document.getElementById("playlistOutput");
    if(document.getElementById("playlistInput").value!="") {
        const createPlaylist = document.getElementById("playlistbtn");
        createPlaylist.addEventListener("click",async ()=>{
            const title = document.getElementById("playlistInput");
            const userID = localStorage.getItem("userID");
            const username = localStorage.getItem("username");
            await fetch("/playlist/createPlaylist/"+userID+"/"+username+"/"+title.value, { method: "POST"})
                .then(async response => {
                    if(response.status===200) {
                        output.innerHTML = "The playlist "+title.value+" has been created!";
                        currentPlaylists = await getPlaylists();
                        populateDropdown();
                    } else if(response.status===204) {
                        output.innerHTML = "There is already a playlist with that title. Please try again";
                    }
                });
        
        });
    } else {
        output.innerHTML = "Please enter a playlist title.";
    }
}

function setupProfileBtns() {
    const addPlaylist = document.getElementById("addToProfile");
    const removePlaylist = document.getElementById("removeFromPlaylist");

    addPlaylist.addEventListener("click", async ()=>{
        const userID = localStorage.getItem("userID");
        if(userID) {
            const playlistSelect = currentPlaylists[document.getElementById("playlistSelect").value];
            const response = await fetch("/profile/addPlaylist/"+playlistSelect.username+"/"+playlistSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){
                console.log("Playlist added");
                displayPlaylist();
            } else {
                console.log("Playlist could not be added");
            }
        } else {
            const playlistSelect = currentPlaylists[document.getElementById("playlistSelect").value];
            const response = await fetch("/profile/removePlaylist/"+playlistSelect.username+"/"+playlistSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){
                console.log("Playlist removed");
                displayPlaylist();
            } else {
                console.log("Playlist could not be removed");
            }
        }
    });
}

async function getPlaylists() { // Gets and stores current playlists by username in currentPlaylists
    
    const username = localStorage.getItem("username")
    let response = await fetch("/playlist/getPlaylists/"+username, { method: "GET" })
    response = await response.json();
    return response.playlists;
}

async function populateDropdown() { // Returns current playlists as dropdown items so user can select one
    const clearList = document.getElementsByClassName("playlistDrop");
    const dropdown = document.getElementById("playlistSelect");
    
    for(let i=0;i<clearList.length;i++) {
        clearList[i].remove();
    } 
    for(let i=0;i<currentPlaylists.length;i++) {
        const option = document.createElement("option");
        option.value = i;
        option.classList.add("playlistDrop")
        option.append(document.createTextNode(currentPlaylists[i].title));
        option.addEventListener("click",()=> {
            displayPlaylist(); // When option is clicked the displayed playlist should update
        });
        dropdown.append(option);
        
    }
}

// The two functions below need to be changed slightly and so were copied instead of put elsewhere and called :*(

async function getTracks() { // Gets tracks from fetch request and calls function to display them.
    const userID = localStorage.getItem("userID")
    if(userID) {
        await fetch("/track/getTracks/"+userID, { method: "GET" })
            .then(async response=>{
                response = await response.json();
                displayTracks(response.tracks);
            });
    }
}

async function displayTracks(tracks) { // Deletes old tracks from list and populates the list with update tracks
    if(tracks.length!=0) { // Only runs if there are tracks to display
        const wrapper = document.getElementById("trackPlaylist");
        const trackList = document.getElementsByClassName("trackEntry");
        for(let i=0;i<trackList.length;) { // Removes all old tracks to avoid duplicates
            trackList[i].remove();
        }
        tracks.reverse();
        displayItems(tracks, "trackEntry", wrapper, true)
        
    }   
}

async function displayPlaylist() { // Gets currently selected playlists songs and displays them.
    currentPlaylists = await getPlaylists(); // Call to refresh playlist.
    const userID = localStorage.getItem("userID")
    if(userID) {
        const selectedPlaylist = document.getElementById("playlistSelect").value;
        const playlist = currentPlaylists[selectedPlaylist];
        let playlistSongs = [];
        console.log(playlist.tracks.length)
        for(let i=0;i<playlist.tracks.length;i++) { // For each stored track ID we must retrieve the details for the song.
            let response = await fetch("/track/returnTrack/"+userID+"/"+playlist.tracks[i], { method: "GET"});
            response = await response.json();
            playlistSongs.push(response.track);
        }
        console.log("PlaylistSongs: "+playlistSongs);

        const wrapper = document.getElementById("playlistList");
        const trackList = document.getElementsByClassName("playlistEntry");
        for(let i=0;i<trackList.length;) { // Removes all old tracks to avoid duplicates
            trackList[i].remove();
        }
        playlistSongs.reverse();
        displayItems(playlistSongs, "playlistEntry", wrapper, false);
            
    } else {
        // Not logged in
    }
}

function displayItems(array, entryClass, target, boolean) { // Boolean switches buttons from add to remove, true for add, false for remove
    array.forEach((track) => { // Creates track entry for each track returned,
        const trackItem = document.createElement("li");
        trackItem.classList.add(entryClass);
        const img = document.createElement("img");
        img.src=track.trackImg;
        const name = document.createElement("h2");
        name.append(document.createTextNode(track.trackName)); 
        const artist = document.createElement("p");
        artist.append(document.createTextNode(track.authorName));
        const addbtn = document.createElement("button");
        if(boolean) {
            addbtn.append(document.createTextNode("Add song"));
            addbtn.addEventListener("click",()=>{addTrack(track.trackID)});
        } else {
            addbtn.append(document.createTextNode("Remove song"));
            console.log("TRACKID: "+track.trackID);
            addbtn.addEventListener("click",()=>{removeTrack(track.trackID)});
        }
        trackItem.append(name);
        trackItem.append(artist);
        trackItem.append(img);
        trackItem.append(addbtn);
        target.append(trackItem);
    })
}

// Seperate functions for readability
async function addTrack(trackID) { // Adds specified track to currently selected playlist
    if(localStorage.getItem("userID")) {
        const userID = localStorage.getItem("userID");
        const title = currentPlaylists[document.getElementById("playlistSelect").value].title;
        await fetch("/playlist/addTrack/"+trackID+"/"+userID+"/"+title, { method: "GET" })
            .then(async response => {
                if(response.status===200){
                    console.log("Track added to selected playlist.");
                    displayPlaylist();
                } else {
                    console.log("Track is already in selected playlist.");
                }
            });
    }
}
async function removeTrack(trackID) { // Removes specified track from currently selected playlist
    if(localStorage.getItem("userID")) {
        const userID = localStorage.getItem("userID");
        const title = currentPlaylists[document.getElementById("playlistSelect").value].title;
        console.log(title);
        await fetch("/playlist/removeTrack/"+trackID+"/"+userID+"/"+title, { method: "GET" })
            .then(async response => {
                if(response.status===200){
                    console.log("Track removed from selected playlist.");
                    displayPlaylist();
                } else {
                    console.log("Track was not removed from playlist.");
                }
            });
    }
}