var twitter = require("twitter");
var keys = require("./key.js");
var twitKeys = new twitter(keys.twitterKeys);

var app = require("./liri.js").myTweets;
var action = process.argv[2];

switch (action) {
    case "my-tweet":
    app.myTweets();
    break;
}

