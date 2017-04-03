//---------DEPENDENCIES-------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //insecure workaround for firewall. temporary

var twitter = require("twitter"); //grabbing twitter npm
var keys = require("./key.js");
var twitKeys = new twitter(keys.twitterKeys);
var spotify = require("spotify");
var request = require("request");

//console.log(twitKeys);
//-----------------------------

//---------Switch-------------
var action = process.argv[2];
var command = process.argv[3];

switch (action) {
    case "my-tweet":
    myTweets();
    break;

    case "spotify-this-song":
    findTrack(command);
    break;

    case "movie-this":
    movie();
    break;

    case "do-what-it-says":
    doIt();
    break;
}

function myTweets() {

    var params = {
        screen_name: "ahang_1",
        count: 20
    }

    twitKeys.get("statuses/user_timeline", params, function(err, data) {
        if (!err) {
            //console.log("About to test loop");
            for (var i = 0; i < data.length; i++) {
                //console.log("Testing Loop" + [i]);
                var user = params.screen_name;
                var tweets = data[i].text;
                var time = data[i].created_at;
                console.log("----------------" + time + "--------------------------");
                console.log("@" + user + " said");
                console.log(tweets);
                console.log("------------------------------------------------------");
            }
            //console.log(tweets);
        } else {
            console.log("There was an err of " + err);
        }
    });
};

function findTrack(userInput) {
    //console.log("Test");
    var trackName = userInput || "The Sign Ace of Base";
    //console.log(trackName);

    spotify.search({ type: "track", query: trackName}, function(err, data) {
        //console.log("Beginning Query");
        if (err) {
             console.log('Error occurred: ' + err);
             return;
        } else {
            var track = data.tracks.items[0];
            //console.log("No errors beginning data retrieval");
            console.log("The Artist(s) is " + track.artists[0].name);
            console.log("The name of the song is " + "'" + track.name + "'");
            console.log("Link: " + track.preview_url);
            console.log("The album is called " + track.album.name + "and this song is track number " + track.track_number);
        }
    });
}

function movie(userInput) {
    console.log("Begin movie function");

    var movieName = userInput || "Mr. Nobody";
    console.log(movieName);

    request("http://www.omdbapi.com/?t=" + movieName, function(err, response, body) {
        if (err) {
            console.log("Error occured: " + err);
        } else {
            var movieInfo = JSON.parse(body);
            //console.log(movieInfo);
            //console.log(JSON.parse(body));
            console.log("---------------Movie Information-------------")
            console.log("The title of the movie is " + movieInfo.Title);
            console.log("The movie was released " + movieInfo.Year);
            console.log("The IMDB Rating for the movie is " + movieInfo.imdbRating);
            console.log("The movie was produced in " + movieInfo.Country);
            console.log("The languages in the movie are " + movieInfo.Language);
            console.log("The main actors/actresses are " + movieInfo.Actors);
            console.log("On Rotten Tomato, they gave it a rating of " + movieInfo.Ratings[1].Value);
            console.log("----------------------------")
        }
    });
}

//-----------------------------