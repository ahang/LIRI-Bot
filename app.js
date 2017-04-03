var app = require("./liri.js");
var action = process.argv[2];

switch (action) {
    case "my-tweet":
    app.myTweet();
    break;
}

