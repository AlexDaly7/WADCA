// Function gotten from https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
function getSpotifyAuth() { // Returns auth token needed to utilise spotify API
    var client_id = '514266725d9e497d82961f957d9e60f4';
    var client_secret = 'b066e0ea58dc40cfb319cd5b95d37b3a';

    fetch('https://accounts.spotify.com/api/token', {
        headers: {
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        },
        method: "POST",
    }).then(response => {
        console.log("response: "+response);
        response = response.json();
        console.log(response);
    })
};

export default getSpotifyAuth();