window.addEventListener("load", ()=>{ // On window load adds event listener to respond to input in searchBar
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", async ()=>{ // Event listener
        if(searchBar.value!="") {
            let response = await fetch("/user/search/"+searchBar.value, {method:"GET"})
            response = await response.json();
            const clearList = document.getElementsByClassName("searchbtn");
            while(clearList.length > 0) { // Delete old list
                clearList[0].remove()
            }
            for (let i=0;i<response.results.length;i++) { // For each result add button
                const searchResult = document.createElement("button");
                searchResult.classList.add("searchbtn");
                searchResult.append(document.createTextNode(response.results[i].username));
                document.getElementById("searchBtnDiv").append(searchResult);
                searchResult.addEventListener("click", ()=>{ // When clicked send to matching username page
                    document.location.href = "/profile/user/"+response.results[i].username;
                });
            }
        } else { // If searchBar is empty and keyup is detected, remove old list
            while(clearList.length > 0) {
                clearList[0].remove()
            }
        }
    })
});
