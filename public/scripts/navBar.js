window.addEventListener("load", ()=>{
    const profileBtn = document.getElementById("navProfile");
    profileBtn.addEventListener("click",()=>{
        const username = localStorage.getItem("username")
        console.log("username");
        if(username!=undefined) {
            document.location.href = "/profile/user/"+username;
        }
    });
});