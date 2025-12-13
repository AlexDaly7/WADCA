let toggleLogin = true; // Toggles between login and sign up

window.addEventListener("load", () => { // Call when page loads
    const formbtn = document.getElementById("loginbtn");
    formbtn.addEventListener("click", async () => { // Add event listener to button
        let userFound = true;
        const username = document.getElementById("loginName");
        const password = document.getElementById("loginPass");
        const output = document.getElementById("loginOutput");
        
        if(username.value!=""&&password.value!="") { // Make sure values arent empty
            if(toggleLogin) { // Login button
                let response = await fetch("/user/login/"+username.value+"/"+password.value, {method: "GET"});
                if(response.status===200) { // If found
                    response = await response.json(); // Parse
                    localStorage.setItem("userID", response.userID); // Set username and userID in localStorage
                    localStorage.setItem("username", username.value);
                    output.innerHTML = "You have been signed in!";
                    // Timeout below gotten from https://flexiple.com/javascript/javascript-sleep
                    setTimeout(() => { // Redirect user to homepage after 1 second of successful login
                        document.location.href="/";
                    }, 1000);
                } else if(response.status===204) { // If not found
                    console.error("That user was not found.");
                    output.innerHTML = "Your details are incorrect, please try again";
                }
            } else { // Sign up button
                if(username.value.length>=5&&password.value.length>=5) { // Make sure inputs are 5 or more characters long
                    const response = await fetch("/user/create/"+username.value+"/"+password.value, {method: "POST"})
                    if(response.status===200) { // If found
                        response = await response.json();
                        localStorage.setItem("userID", response.userID); // Add details to localStorage
                        localStorage.setItem("username", response.username);
                        output.innerHTML = "Your account has been created!";
                    } else if(response.status===204) {
                        output.innerHTML = "There is already an account with that name."
                    }
                } else { // Validation
                    output.innerHTML = "Please make sure your username and password are longer than 5 characters."
                }
            }
        } else {
            output.innerHTML = "Please enter your details";
        }
    });
    // Toggle login / signup button
    const togglebtn = document.getElementById("loginToggle");
    togglebtn.addEventListener("click", () => { // If clicked swaps button to opposite mode
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
