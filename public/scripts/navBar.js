window.addEventListener("load", ()=>{
    const profileBtn = document.getElementById("navProfile");
    profileBtn.addEventListener("click",()=>{
        const username = localStorage.getItem("username")
        if(username) {
            document.location.href = "/profile/user/"+username;
        }
    });
});