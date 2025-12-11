
window.addEventListener("load",()=>{
    const userDisplay = document.getElementById("userDisplay");
    const logout = document.getElementById("logoutBtn");
    const userID = localStorage.getItem("userID")
    if(userID) {
        const username = localStorage.getItem("username");
        userDisplay.innerHTML = `You are logged in as ${username}.`;
        logout.addEventListener("click",()=>{
            userDisplay.innerHTML="Your are not logged in."
            localStorage.removeItem("username");
            localStorage.removeItem("userID");
            logout.style.display="none";
        });
        logout.style.display="inline-block";
    } else {
        userDisplay.innerHTML = "You are not logged in.";
        logout.style.display="none";
    }
});