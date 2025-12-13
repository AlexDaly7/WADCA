window.addEventListener("load", ()=>{ // When window load
    const profileBtn = document.getElementById("navProfile");
    profileBtn.addEventListener("click",()=>{ // Make My Profile link redirect to logged in users profile.
        const username = localStorage.getItem("username")
        console.log("username");
        if(username!=undefined) {
            document.location.href = "/profile/user/"+username;
        } else { // Get rid of My Profile button if not signed in and button is clicked
            profileBtn.style.display="none";
        }
    });
});