
async function loadProfile() {
    if(localStorage.getItem("userID")) {
        let userID = localStorage.getItem("userID");
        await fetch("", { method: "GET" })
            .then(async response => {
                if(response.status(200)) {
                    response = response.json();
                    console.log(response);
                } else if (response.status(204)) {
                    
                } else {

                }
            });
    } else {
        // Not logged in
    }
}