//---------DEPENDICIES-------------
var twitter = require("twitter");
var keys = require("./key.js");
var twitKeys = new twitter(keys.twitterKeys);
var spotify = require("spotify");
var request = require("request");

//console.log(twitKeys);
//-----------------------------

//---------Switch-------------
var action = process.argv[2];

switch (action) {
    case "my-tweet":
    myTweets();
    break;

    case "spotify-this-song":
    spotify();
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

function spotify() {
    
}

//-----------------------------