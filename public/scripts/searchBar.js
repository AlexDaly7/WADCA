window.addEventListener("load", ()=>{
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", async ()=>{
        let lastLength;
        if(searchBar.value!="") {
            await fetch("/user/search/"+searchBar.value, {method:"GET"})
                .then(async response => {
                    response = await response.json();
                    console.log(response);
                    for (let i=0;i<response.results.length;i++) {
                        console.log(response.results[i].username)
                        if(document.getElementById("searchbtn"+i)) {
                            document.getElementById("searchbtn"+i).remove();
                        }
                        const searchResult = document.createElement("button");
                        searchResult.id="searchbtn"+i;
                        searchResult.classList.add("searchbtn");
                        searchResult.append(document.createTextNode(response.results[i].username));
                        document.getElementById("searchBtnDiv").append(searchResult);
                        searchResult.addEventListener("click", ()=>{
                            document.location.href = "/profile/"+response.results[i].username;
                        })
                    }
                })
        } else {
            for(let i=0;i<2;i++) {
                if(document.getElementById("searchbtn"+i)) {
                    document.getElementById("searchbtn"+i).remove();
                }
            }
        }
    })
     
});
