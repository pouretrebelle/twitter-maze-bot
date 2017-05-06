'use strict';

var Twitter = require('twitter');
var deasync = require('deasync');
var env = require('dotenv').config();
var fs = require('fs');
var osc = require('node-osc');

let contributors = [];
let trackingId = '';

// setup twitter client
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


// Setup OSC sender and receiver
//=====================================

var oscClient = new osc.Client('127.0.0.1', 6001);
var oscServer = new osc.Server(6002, '127.0.0.1');


// Stream tweets mentioning username
//=====================================

client.stream('statuses/filter', {track: '@'+process.env.TWITTER_USERNAME}, function(stream) {
  stream.on('data', function(event) {
    // if the streamed tweet is a reply to the tracked one then respond to it
    if (event.in_reply_to_status_id_str == trackingId) {
      respondToTweet(event);
    }
  });
  stream.on('error', function(error) {
    throw error;
  });
});


// Send initial maze
//=====================================

function newMaze() {
  // reset contributors
  contributors = [];

  var image = fs.readFileSync('../bin/data/new.jpg');
  var imageId = uploadMedia(image);
  if (imageId) {
    var tweetId = postTweet({
      status: 'Tweet me directions',
      mediaId: imageId
    }).id_str;
    trackingId = tweetId;
  }
}


// Respond to maze completion message
//=====================================

oscServer.on('message', function (msg, rinfo) {
  if (msg[2][0] == '/complete') {

    // compose tweet string
    var status = 'Maze completed!';
    if (contributors.length != 0) {
      status += '\nThanks to ';
      // add contributors
      var i = 0;
      while (status.length <= 141 && i < contributors.length) {
        status += contributors[i]+', ';
        i++;
      }
      // trim last 2 characters
      status = status.substring(0, status.length - 2);
      // if it's still longer than 140
      if (status.length > 140) {
        // remove the last username and its comma and space
        var trim = 2 + contributors[i-1].length;
        // add an ellipses
        status = status.substring(0, status.length - trim) + '…';
      }
    }

    var image = fs.readFileSync('../bin/data/complete.jpg');
    var imageId = uploadMedia(image);
    var tweetData = postTweet({
      status: status,
      mediaId: imageId,
    });
    newMaze();
  }
});


// Respond to a tweet
//=====================================

function respondToTweet(event) {
  // sanitise tweet text by removing punctuation and converting to lowercase
  var text = event.text;
  text = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '');

  oscClient.send('/update', text, event.user.profile_link_color, function (err) {
    if (err) {
      console.error(new Error(err));
    }
    else {
      // leave a second so oF has time to do its thang
      setTimeout(function() {sendReply(event)}, 1000);
    }
  });
}

function sendReply(event) {
  // add username to list of contributors
  if (contributors.indexOf('@'+event.user.screen_name) == -1) {
    contributors.push('@'+event.user.screen_name);
  }

  var image = fs.readFileSync('../bin/data/current.jpg');
  var imageId = uploadMedia(image);
  var tweetData = postTweet({
    status: '@'+event.user.screen_name,
    mediaId: imageId,
    replyId: event.id_str,
  });

  if (tweetData) {
    trackingId = tweetData.id_str;
  }
}


// Post a tweet
//=====================================

function postTweet(data) {
  var ret;
  var tweetData = {
    status: data.status,
    media_ids: data.mediaId // Pass the media id string
  }

  // if it's in reponse to an id
  if (data.replyId) tweetData.in_reply_to_status_id = data.replyId;

  client.post('statuses/update', tweetData, function(error, data, response) {
    if (!error) {
      // return the data of successful tweet;
      ret = data;
    }
    else {
      ret = false;
    }
  });
  deasync.loopWhile(function(){ return ret === undefined });
  return ret;
}


// Upload an image
//=====================================

function uploadMedia(image) {
  var ret;
  client.post('media/upload', {media: image}, function(error, data, response) {
    if (!error) {
      ret = data.media_id_string;
    }
    else {
      ret = false;
    }
  });
  deasync.loopWhile(function(){ return ret === undefined });
  return ret;
}

// Post new maze on server start
oscClient.send('/initialise', function (err) {
  if (!err) {
    setTimeout(newMaze, 1000);
  }
});
