"use strict";

//---------DEPENDENCIES-------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //insecure workaround for firewall. temporary

var twitter = require("twitter"); //grabbing twitter npm
var keys = require("./key.js");
var twitKeys = new twitter(keys.twitterKeys);
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

//console.log(twitKeys);
//-----------------------------

//---------Switch-------------
var action = process.argv[2];
var command = process.argv[3];

values(action, command);

function values(action, command) {
    switch (action) {
        case "my-tweet":
        myTweets();
        break;

        case "spotify-this-song":
        findTrack(command);
        break;

        case "movie-this":
        movie(command);
        break;

        case "do-what-it-says":
        doIt();
        break;
    }
}
//appending the data from the logs
function logs(data) {
    fs.appendFile("logs.txt", data, function(err, data) {
        if (err) throw err;
    })
}
//console.logging the data and calling the logs function for each case
function debug(str) {
    console.log(str);
    logs(str + "\n");

}

function myTweets() {
    //pass the screen_name and count parameter into .get for twitter
    var params = {
        screen_name: "ahang_",
        count: 20
    }

    twitKeys.get("statuses/user_timeline", params, function(err, data) {
        if (!err) { //if no error
            //console.log("About to test loop");
            for (var i = 0; i < data.length; i++) {

                //console.log("Testing Loop" + [i]);
                var time = data[i].created_at;
                var user = params.screen_name;
                var tweets = data[i].text;
                debug("------------------------------------------------------");
                debug(time);
                debug("@" + user + " said");
                debug(tweets);
                debug("------------------------------------------------------");
            }
            //console.log(tweets);
        } else {
            console.log("There was an err of " + err);
        }
    });
};

function findTrack(command) {
    //console.log("Test");
    var trackName = command || "The Sign Ace of Base";
    //console.log(trackName);

    spotify.search({ type: "track", query: trackName}, function(err, data) {
        //console.log("Beginning Query");
        if (err) {
             console.log('Error occurred: ' + err);
             return;
        } else {
            var track = data.tracks.items[0];
            //console.log(track);
            //console.log("No errors beginning data retrieval");
            debug("The Artist(s) is " + track.artists[0].name);
            debug("The name of the song is " + "'" + track.name + "'");
            debug("Link: " + track.preview_url);
            debug("The album is called " + track.album.name + " and this song is track number " + track.track_number);
        }
    });
}

function movie(command) {
    //console.log("Begin movie function");
    //console.log(userInput);
    var movieName = command.split(" ").join("+") || "Mr.+Nobody";
    //console.log(movieName);

    request("http://www.omdbapi.com/?t=" + movieName, function(error, response, body) {
        var movieInfo = JSON.parse(body);
        if (error) {
            return console.log("Error occured: " + error);
        } else if(movieInfo.Response === "False") {
            return console.log("Error occured: " + movieInfo.Error);
        } else {
            //console.log(movieInfo);
            //console.log(JSON.parse(body));
            debug("---------------Movie Information-------------")
            debug("The title of the movie is " + movieInfo.Title);
            debug("The movie was released " + movieInfo.Year);
            debug("The IMDB Rating for the movie is " + movieInfo.imdbRating);
            debug("The movie was produced in " + movieInfo.Country);
            debug("The languages in the movie are " + movieInfo.Language);
            debug("The main actors/actresses are " + movieInfo.Actors);
            debug("On Rotten Tomato, they gave it a rating of " + movieInfo.Ratings[1].Value);
            var movieChange = movieInfo.Title.split(" ").join("_");
            var lowerMovie = movieChange.toLowerCase();
            debug("Check out the Rotten Tomato review here https://www.rottentomatoes.com/m/" + lowerMovie);
            debug("----------------------------");
        }
    });
}

function doIt() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) throw err;

        //console.log(data);

        var dataArr = data.split(","); //splitting at the comma
        //console.log(dataArr);

        values(dataArr[0].trim(),dataArr[1].trim()); //feeding the dataArr into the values function
    });
}
//-----------------------------


