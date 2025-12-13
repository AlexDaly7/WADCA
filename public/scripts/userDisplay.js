// Grab user info from localStorage and let user know what account they are signed into, also logout button
window.addEventListener("load",()=>{
    const userDisplay = document.getElementById("userDisplay");
    const logout = document.getElementById("logoutBtn");
    const userID = localStorage.getItem("userID")
    if(userID) {
        const username = localStorage.getItem("username");
        userDisplay.innerHTML = `You are logged in as ${username}.`; // Display username
        logout.addEventListener("click",()=>{ // Logout btn event listener
            userDisplay.innerHTML="Your are not logged in."
            localStorage.removeItem("username"); // Wipe localStorage
            localStorage.removeItem("userID");
            logout.style.display="none";
        });
        logout.style.display="inline-block";
    } else {
        userDisplay.innerHTML = "You are not logged in.";
        logout.style.display="none";
    }
});