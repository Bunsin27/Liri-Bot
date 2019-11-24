// THE Npms
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");

//Spotify keys(this does not work as implemented)
const env = process.env;

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: env.SPOTIFY_ID,
    secret: env.SPOTIFY_SECRET
});

var query = process.argv;
var type = process.argv[2];
var array = [];

//Loopdaloop
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1);
var userQuery = array.join("");

//the Switch 
switch (type) {
    case 'concert-this':
        concertthis()
        break;
    case 'spotify-this-song':
        spotifyIt()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'do-what-it-says':
        itSays()
        break;
    default:
        console.log("No type value found");
}


// concert-this

function concertthis() {
    if (userQuery === "") {
        console.log('\n')
        console.log("No Artist entered. Please enter an Artist")
        console.log('\n')
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp").then(
            function (response) {
                if (response.data.length <= 0) {
                    console.log("No info for this Artist")
                } else {
                    for (var i = 0; i < response.data.length; i++) {

                        var currData = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Event Date: ${moment(response.data[i].datetime).format('LL')}
            `
                        console.log(currData)
                    }
                }

                dataLog(currData)
            }
        );
    }
}

//  spotify-this-song

function spotifyIt() {

    if (userQuery === "") {
        userQuery = "ace+of+base+the+sign"
    }

    spotify.search({
        type: 'artist,track',
        query: userQuery
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n')

        var currData = `\n
    Artist: ${data.tracks.items[0].artists[0].name}
    Track: ${data.tracks.items[0].name}
    Preview: ${data.tracks.items[0].preview_url}
    Album: ${data.tracks.items[0].album.name}
            `
        console.log(currData)
        dataLog(currData)

    });
}

//  movie-this

function movieThis() {

    if (userQuery === "") {
        userQuery = "mr+nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            var currData = `\n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
            `
            console.log(currData)
            dataLog(currData)
        }
    );


}

// do-what-it-says

function itSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        userQuery = dataArr[1];
        spotifyIt()
    });
}

//Input Logger saved as log.txt in folder
var logQuery = query.splice(0, 2)
logQuery = "\n" + query.join(" ") + "\n"
console.log(logQuery)

fs.appendFile("log.txt", logQuery, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log("Log Updated");
    }

});

//Data Logger saved as log.txt in folder

function dataLog(data) {
    fs.appendFile("log.txt", data, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log("Log Updated");
        }

    });
}