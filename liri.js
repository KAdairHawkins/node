var key = require("./key.js");
//console.log(key);
var Twitter = require("twitter");

var Spotify = require("node-spotify-api");
var request = require('request');
var fs = require('fs');
var spotify = new Spotify({
  id: "a410d70b5b0b481cb8d213217b60f308",
  secret: '8d094ba027574b7ba38b13ae1f8aeff3'
});

var client = new Twitter(key);
var command = process.argv[2];
function liriSpotify(songTitle) {
  spotify.search({ type: "track", query: songTitle }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var arrayOfTracks = data.tracks.items;
    for (var i = 0; i < arrayOfTracks.length; i++) {
      console.log(
        "Artist: ",
        arrayOfTracks[i].artists.map(function(artist) {
          return artist.name;
        })
      );
      console.log("Song Title: ", arrayOfTracks[i].name);
      console.log("Album Name: ", arrayOfTracks[i].album.name);
      console.log("External URL: ", arrayOfTracks[i].external_urls.spotify);
    }
  });
}
if(command == "my-tweets"){
  var screenName = process.argv[3];
  var params = {screen_name: screenName};
  client.get("statuses/user_timeline", params, function(error, tweets, response){
    if (!error) {
      var arr = tweets;
      for(var tweets in arr) {
        console.log(arr[tweets].text);
      }
    }
      else {
        console.log(error);
    }
  })
} else if(command == 'spotify-this-song') {
  var songTitle = process.argv[3];
    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    var arrayOfTracks = data.tracks.items
    for (var i = 0; i < arrayOfTracks.length; i++) {
      console.log("Artist: ", arrayOfTracks[i].artists.map(function(artist){
        return artist.name;
      }))
      console.log("Song Title: ", arrayOfTracks[i].name);
      console.log("Album Name: ", arrayOfTracks[i].album.name);
      console.log("External URL: ", arrayOfTracks[i].external_urls.spotify)
    }
});
} else if(command == "movie-this"){
  var movieName = process.argv[3];
  console.log(movieName);
  var url = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieName;
  request(url, function (error, response, body) {
    var movieData = JSON.parse(body);
    console.log(movieData.Title);
    console.log(movieData.Year);
    console.log(movieData.Rated);
    console.log(movieData.Country);
    console.log(movieData.Plot);
    console.log(movieData.Language);
    console.log(movieData.Actors);
    console.log(movieData.Ratings.filter(function(rating){
      if(rating.Source == "Rotten Tomatoes") {
          return rating.Value;
      }
    }))
});
} else if(command == "do-what-it-says"){
  fs.readFile("random.txt", "UTF-8", function(err, data){
    var splitData = data.split(",");
    liriSpotify(splitData[1]);
  })
} else if(command == "log") {
  var textToAdd = process.argv[3];
  fs.appendFile("log.txt", textToAdd, function(err, data){
    if (!err) {
    console.log("I wrote something in the log.")
    }
  })
}
