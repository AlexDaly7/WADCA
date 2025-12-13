let currentPlaylists; // Arrays to store up to date playlist data
let profilePlaylists;

const userID = localStorage.getItem("userID"); // Get userID for page

window.addEventListener("load",async ()=>{ // Queues events to happen when the window loads
    if(userID) {
        currentPlaylists = await getPlaylists(); // Load users playlists
        if(currentPlaylists) { // If user has playlists display them
            populateDropdown();
            displayPlaylist();
        }
        addPlaylistBtn(); // Adds listeners to buttons
        getTracks(); // Gets and displays tracks
        setupProfileBtns(); // Sets up buttons that handle editing playlists for profile
        populateProfileDropdown(); // Add dropdown options for profile select
    }
});

// Add functionality to add playlist button
async function addPlaylistBtn() {
    const output = document.getElementById("playlistOutput");
    const createPlaylist = document.getElementById("playlistbtn");
    const title = document.getElementById("playlistInput");
    createPlaylist.addEventListener("click",async ()=>{ // Event listener
        if(title.value!=="") { // If not empty
            if(title.value.length<=20) { // And under 20 characters
                const username = localStorage.getItem("username");
                const response = await fetch("/playlist/createPlaylist/"+userID+"/"+username+"/"+title.value, { method: "POST"})
                if(response.status===200) { // If found
                    output.innerHTML = "The playlist "+title.value+" has been created!";
                    currentPlaylists = await getPlaylists();
                    populateDropdown(); // Update dropdown
                } else if(response.status===204) { // If not found
                    output.innerHTML = "There is already a playlist with that title. Please try again";
                }
            } else {
                output.innerHTML = "Please keep the playlist name under 15 characters."
            }
        } else {
            output.innerHTML = "Please enter a playlist title.";
        }
    })
};

// Add functionality to profile buttons
function setupProfileBtns() {
    const addPlaylist = document.getElementById("addToProfile");
    const removePlaylist = document.getElementById("removeFromProfile");

    addPlaylist.addEventListener("click",async ()=>{ // Add event listener
        let playlistSelect = currentPlaylists[document.getElementById("playlistSelect").value];
        if(profileSelect!==undefined) { // Make sure a playlist is selected
            const response = await fetch("/profile/addPlaylist/"+playlistSelect.username+"/"+playlistSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){ // If added
                console.log("Playlist added");
                displayPlaylist(); // Update dropdown and display
                populateProfileDropdown()
            } else {
                console.log("Playlist could not be added");
            }
        }
    });
    removePlaylist.addEventListener("click",async ()=>{ // Remove event listener
        let profileSelect = profilePlaylists[document.getElementById("profileSelect").value];
        if(profileSelect!==undefined) { // Make sure a playlist is selected
            const response = await fetch("/profile/removePlaylist/"+profileSelect.username+"/"+profileSelect.title+"/"+userID, { method: "POST"});
            if(response.status===200){ // If found
                console.log("Playlist removed");
                populateProfileDropdown(); // Update dropdown
            } else {
                console.log("Playlist could not be removed");
            }
        } else {
            populateProfileDropdown(); // Update dropdown
        }
    });
}

// Get a profiles list of playlists, userID for verification
async function getProfile() {
    let response = await fetch("/profile/getPlaylists/"+userID, { method: "GET" });
    if(response.length!=0) 
    response = await response.json();
    return response.playlists;
}

// Display buttons for profile playlists dropdown
async function populateProfileDropdown() {
    profilePlaylists = await getProfile() // Update list before using it
    const dropdown = document.getElementById("profileSelect");
    const clearList = document.getElementsByClassName("profileDrop");
    while(clearList.length > 0) { // Delete old list
        clearList[0].remove()
    }
    for(let i=0;i<profilePlaylists.length;i++) { // Create option with value according to array and add to dropdown
        const option = document.createElement("option");
        option.value = i;
        option.classList.add("profileDrop")
        option.append(document.createTextNode(profilePlaylists[i].title));
        dropdown.append(option);
    }
    
}

// Gets and stores current playlists by username in currentPlaylists
async function getPlaylists() {
    const username = localStorage.getItem("username");
    let response = await fetch("/playlist/getPlaylists/"+username, { method: "GET" });
    if(response.status==200) { // If found return
        response = await response.json();
        return response.playlists;
    } else if(response.status==204) { // If not return null
        return null;
    }
}

// Displays current playlists as dropdown items so user can select one
async function populateDropdown() { 
    const clearList = document.getElementsByClassName("playlistDrop");
    const dropdown = document.getElementById("playlistSelect");
    
    while(clearList.length > 0) { // Remove old list
        clearList[0].remove()
    }
    for(let i=0;i<currentPlaylists.length;i++) { // For each playlist add an option
        const option = document.createElement("option");
        option.value = i;
        option.classList.add("playlistDrop")
        option.append(document.createTextNode(currentPlaylists[i].title));
        option.addEventListener("click",()=> {
            displayPlaylist(); // When option is clicked the displayed playlist will update
        });
        dropdown.append(option);
        
    }
}

// Gets tracks from fetch request, deletes old displayed tracks and calls function to generate new ones
async function getTracks() {
    let response = await fetch("/track/getTracks/"+userID, { method: "GET" });
    response = await response.json();
    if(response.tracks.length!=0) { // Only runs if there are tracks to display
        const wrapper = document.getElementById("trackPlaylist");
        const trackList = document.getElementsByClassName("trackEntry");
        while(trackList.length > 0) {
            trackList[0].remove(); // Remove old list
        }
        response.tracks.reverse();
        displayItems(response.tracks, "trackEntry", wrapper, true); // Display items in passed in array
    }   
}

// Gets currently selected playlists songs and displays them.
async function displayPlaylist() { 
    currentPlaylists = await getPlaylists(); // Call to refresh playlist.
    const playlist = currentPlaylists[document.getElementById("playlistSelect").value]; // Get playlist according to selected dropdown value
    let playlistSongs = [];
    if(playlist) {
        for(let i=0;i<playlist.tracks.length;i++) { // For each stored track ID retrieve the details for the song.
            let response = await fetch("/track/returnTrack/"+userID+"/"+playlist.tracks[i], { method: "GET"});
            response = await response.json();
            playlistSongs.push(response.track); // Push track to array
        }
        const wrapper = document.getElementById("playlistList");
        const trackList = document.getElementsByClassName("playlistEntry");
        while(trackList.length > 0) { // Remove old list
            trackList[0].remove()
        }
        playlistSongs.reverse(); // Reverse list to show newest first
        displayItems(playlistSongs, "playlistEntry", wrapper, false); // Display items in passed in array
    }
}

// Creates and appends track entries to target ID element
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

// Adds specified track to currently selected playlist
async function addTrack(trackID) {
    const title = currentPlaylists[document.getElementById("playlistSelect").value].title;
    const response = await fetch("/playlist/addTrack/"+trackID+"/"+userID+"/"+title, { method: "GET" })
    if(response.status===200){
        console.log("Track added to selected playlist.");
        displayPlaylist();
    } else {
        console.log("Track is already in selected playlist.");
    }
}

// Removes specified track from currently selected playlist
async function removeTrack(trackID) {
    const userID = localStorage.getItem("userID");
    const title = currentPlaylists[document.getElementById("playlistSelect").value].title;
    let response = await fetch("/playlist/removeTrack/"+trackID+"/"+userID+"/"+title, { method: "GET" })
    if(response.status===200){
        console.log("Track removed from selected playlist.");
        displayPlaylist();
    } else {
        console.log("Track was not removed from playlist.");
    }
}