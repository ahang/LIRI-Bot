"use strict";

//---------DEPENDENCIES-------------
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //insecure workaround for firewall. temporary

var twitter = require("twitter"); //grabbing twitter npm
var keys = require("./key.js");
var twitKeys = new twitter(keys.twitterKeys);
var spotify = require("spotify"); //grabbing spotify npm
var request = require("request"); //grabbing request npm
var fs = require("fs"); //grabbing file system npm

//console.log(twitKeys);
//-----------------------------

//---------Switch-------------
var action = process.argv[2];
var command = process.argv[3];

values(action, command);

function values(action, command) {
    switch (action) {
        case "my-tweets":
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
                //loop through the twitter data and append the time/username and tweet for the last 20 tweets
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
    //checks to see if command had a value if not then use The Sign song inputs the trackname as the query search
    var trackName = command || "The Sign Ace of Base";
    //console.log(trackName);

    spotify.search({
        type: "track",
        query: trackName
    }, function(err, data) {
        //console.log("Beginning Query");
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            var track = data.tracks.items[0];
            //if there is no errors grab the first index of the JSON and append the artist(s), name of the track, preview link and album name and track number
            //console.log(track);
            //console.log("No errors beginning data retrieval");
            debug("------------------------------------------------------");
            debug("The Artist(s) is " + track.artists[0].name);
            debug("The name of the song is " + "'" + track.name + "'");
            debug("Link: " + track.preview_url);
            debug("The album is called " + track.album.name + " and this song is track number " + track.track_number);
            debug("------------------------------------------------------");
        }
    });
}

function movie(command) {
    //console.log("Begin movie function");
    //console.log(userInput);
    //Ran into an issue with using command || Mr Nobody. Broke it apart and checks to see if command is undf. If it isn't then use that for the movieName else use Mr Nobody as default
    if (command === undefined) {
        command = "Mr.+Nobody";
    } else {
        command = command.split(" ").join("+");
    }

    var movieName = command;
    //console.log(movieName);

    request("http://www.omdbapi.com/?t=" + movieName, function(error, response, body) {
        //sends a request to omdb and adds the movieName to the end of the query url
        var movieInfo = JSON.parse(body);
        if (error) {
            return console.log("Error occured: " + error);
        } else if (movieInfo.Response === "False") {
            return console.log("Error occured: " + movieInfo.Error);
        } else {
            //console.log(movieInfo);
            //console.log(JSON.parse(body));
            //If the movie is valid, append the title, year, imdb rating, country, language, actors, rotten tomato rating and link to the review
            debug("---------------Movie Information-------------")
            debug("The title of the movie is " + movieInfo.Title);
            debug("The movie was released " + movieInfo.Year);
            debug("The IMDB Rating for the movie is " + movieInfo.imdbRating);
            debug("The movie was produced in " + movieInfo.Country);
            debug("The languages in the movie are " + movieInfo.Language);
            debug("The main actors/actresses are " + movieInfo.Actors);
            debug("On Rotten Tomato, they gave it a rating of " + movieInfo.Ratings[1].Value);
            var movieChange = movieInfo.Title.split(" ").join("_"); //rotten tomato doesnt accept spaces at the end of the url. remove the spaces and add _ for each space.
            movieChange = movieChange.replace(":", ""); //certain movies have : in the name so for safety if its there, it will replace the : with a backspace
            //console.log("movieChange: " + movieChange);
            var lowerMovie = movieChange.toLowerCase(); //lowercaseing
            debug("Check out the Rotten Tomato review here https://www.rottentomatoes.com/m/" + lowerMovie);
            debug("----------------------------");
        }
    });
}

function doIt() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) throw err;

        //console.log(data);

        var dataArr = data.split(","); //splitting at the comma
        //console.log(dataArr);

        values(dataArr[0].trim(), dataArr[1].trim()); //feeding the dataArr into the values function
    });
}
//-----------------------------