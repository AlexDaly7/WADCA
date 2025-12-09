let toggleLogin = true;

window.addEventListener("load", () => {
    const formbtn = document.getElementById("loginbtn");
    formbtn.addEventListener("click", async () => {
        let userFound = true;
        const username = document.getElementById("loginName");
        const password = document.getElementById("loginPass");
        const output = document.getElementById("loginOutput");
        
        if(username.value!=""&&password.value!="") {
            if(toggleLogin) {
                await fetch("/user/login/"+username.value+"/"+password.value, {method: "GET"})
                    .then(async response => {
                        console.log(response.status);
                        if(response.status===200) {
                            response = await response.json();
                            localStorage.setItem("userID", response.userID);
                            output.innerHTML = "You have been signed in!";
                        } else if(response.status===204) {
                            console.error("That user was not found.");
                            output.innerHTML = "Your details are incorrect, please try again";
                        }
                    });
            } else {
                if(username.value.length>=5&&password.value.length>=5) {
                    await fetch("/user/create/"+username.value+"/"+password.value, {method: "GET"})
                        .then(async response => {
                            console.log(response.status);
                            if(response.status===200) {
                                response = await response.json();
                                localStorage.setItem("userID", response.userID);
                                output.innerHTML = "Your account has been created!";
                            } else if(response.status===204) {
                                output.innerHTML = "There is already an account with that name."
                            }
                        });
                } else {
                    output.innerHTML = "Please make sure your username and password are longer than 5 characters."
                }
            }
        } else {
            output.innerHTML = "Please enter your details";
        }
    });
    const togglebtn = document.getElementById("loginToggle");
    togglebtn.addEventListener("click", () => {
        if(toggleLogin) {
            formbtn.innerHTML="Sign up";
            togglebtn.innerHTML="Login.";
        } else {
            formbtn.innerHTML="Login.";
            togglebtn.innerHTML="Sign up";
        }
        toggleLogin=!toggleLogin;
    });
});
