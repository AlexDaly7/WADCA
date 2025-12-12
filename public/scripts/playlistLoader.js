let currentPlaylists;
let profilePlaylists;

window.addEventListener("load",async ()=>{ // Queues events to happen when the window loads
    const userID = localStorage.getItem("userID");
    if(userID) {
        currentPlaylists = await getPlaylists();
        addPlaylistBtn();
        populateDropdown();
        getTracks();
        displayPlaylist();
        setupProfileBtns();
        populateProfileDropdown();
    } else {

    }
});

async function addPlaylistBtn() {
    const output = document.getElementById("playlistOutput");
    const createPlaylist = document.getElementById("playlistbtn");
    const title = document.getElementById("playlistInput");
    createPlaylist.addEventListener("click",async ()=>{
        if(title.value!=="") {
            if(title.value.length<=15) {
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
            } else {
                output.innerHTML = "Please keep the playlist name under 15 characters."
            }
        } else {
            output.innerHTML = "Please enter a playlist title.";
        }
    })
};

function setupProfileBtns() {
    const addPlaylist = document.getElementById("addToProfile");
    const removePlaylist = document.getElementById("removeFromProfile");

    addPlaylist.addEventListener("click",async ()=>{
        const userID = localStorage.getItem("userID");
        if(userID) {
            const playlistSelect = currentPlaylists[document.getElementById("playlistSelect").value];
            const response = await fetch("/profile/addPlaylist/"+playlistSelect.username+"/"+playlistSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){
                console.log("Playlist added");
                displayPlaylist();
                populateProfileDropdown()
            } else {
                console.log("Playlist could not be added");
            }
        } else {
        
        }
    });
    removePlaylist.addEventListener("click",async ()=>{
        const userID = localStorage.getItem("userID");
        const profileSelect = profilePlaylists[document.getElementById("profileSelect").value];
        if(profileSelect!==undefined) {
            const response = await fetch("/profile/removePlaylist/"+profileSelect.username+"/"+profileSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){
                console.log("Playlist removed");
                populateProfileDropdown();
            } else {
                console.log("Playlist could not be removed");
            }
        } else {
            populateProfileDropdown();
        }
    });
}

async function getProfile() {
    const userID = localStorage.getItem("userID");
    if(userID) {
        let response = await fetch("/profile/getPlaylists/"+userID, { method: "GET" });
        response = await response.json();
        return response.playlists;
    } else {

    }
}

async function populateProfileDropdown() {
    profilePlaylists = await getProfile()
    const dropdown = document.getElementById("profileSelect");
    const clearList = document.getElementsByClassName("profileDrop");
    while(clearList.length > 0) {
        clearList[0].remove()
    }
    for(let i=0;i<profilePlaylists.length;i++) {
        console.log(profilePlaylists);
        const option = document.createElement("option");
        option.value = i;
        option.classList.add("profileDrop")
        option.append(document.createTextNode(profilePlaylists[i].title));
        dropdown.append(option);
    }
    
}

async function getPlaylists() { // Gets and stores current playlists by username in currentPlaylists
    const username = localStorage.getItem("username")
    let response = await fetch("/playlist/getPlaylists/"+username, { method: "GET" })
    if(response.status=200) {
        response = await response.json();
        return response.playlists;
    } else if(response.status=204) {
        return null;
    }
    
}

async function populateDropdown() { // Returns current playlists as dropdown items so user can select one
    const clearList = document.getElementsByClassName("playlistDrop");
    const dropdown = document.getElementById("playlistSelect");
    
    while(clearList.length > 0) {
        clearList[0].remove()
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


async function getTracks() { // Gets tracks from fetch request and calls function to display them.
    const userID = localStorage.getItem("userID")
    if(userID) {
        let response = await fetch("/track/getTracks/"+userID, { method: "GET" })
        if(response)
        response = await response.json();
        displayTracks(response.tracks);
    }
}

async function displayTracks(tracks) { // Deletes old tracks from list and populates the list with updated tracks
    if(tracks.length!=0) { // Only runs if there are tracks to display
        const wrapper = document.getElementById("trackPlaylist");
        const trackList = document.getElementsByClassName("trackEntry");
        while(trackList.length > 0) {
            trackList[0].remove()
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
        if(playlist) {
            for(let i=0;i<playlist.tracks.length;i++) { // For each stored track ID we must retrieve the details for the song.
                let response = await fetch("/track/returnTrack/"+userID+"/"+playlist.tracks[i], { method: "GET"});
                response = await response.json();
                playlistSongs.push(response.track);
            }
            const wrapper = document.getElementById("playlistList");
            const trackList = document.getElementsByClassName("playlistEntry");
            while(trackList.length > 0) {
                trackList[0].remove()
            }
            playlistSongs.reverse();
            displayItems(playlistSongs, "playlistEntry", wrapper, false);
        }
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
        if(boolean) { // Adds event listener for add/remove depending on boolean
            addbtn.append(document.createTextNode("Add song"));
            addbtn.addEventListener("click",()=>{addTrack(track.trackID)});
        } else {
            addbtn.append(document.createTextNode("Remove song"));
            console.log("TRACKID: "+track.trackID);
            addbtn.addEventListener("click",()=>{removeTrack(track.trackID)});
        }
        trackItem.append(name); // Appends created elements to element with target id
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