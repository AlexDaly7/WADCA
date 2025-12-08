window.addEventListener("load", () => {
    const form = document.getElementById("submitbtn");
    form.addEventListener("click", async () => {
        let userFound = true;
        const username = document.getElementById("loginName");
        const password = document.getElementById("loginPass");
        const output = document.getElementById("loginOutput");
        await fetch("/login/login/"+username.value+"/"+password.value, {method: "GET"})
        .then(response => {
            console.log(response.status);
            if(response.status==200) {
                response = response.json(); 
                console.log(response.userId);
            } else if(response.status==404) {
                console.error("That user was not found.");
            }
             
        })
    });
});
