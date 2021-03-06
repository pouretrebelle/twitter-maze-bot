import deasync from 'deasync';
import Twitter from 'twitter';

class TwitterUtils {
  constructor(config, username, canvas, maze) {
    this.canvas = canvas;
    this.maze = maze;
    this.username = username;
    this.contributors = [];
    this.trackingId = '';

    // setup twitter client
    this.client = new Twitter(config);

    this.setupStream();
    this.newMaze();
  }

  setupStream() {
    const onData = this.processStream;
    const onError = this.processError;
    this.client.stream('statuses/filter', {track: '@'+this.username}, function(stream) {
      stream.on('data', onData);
      stream.on('error', onError);
    });
  }


  // Processing
  //===================================

  processStream = (event) => {
    // if the streamed tweet is a reply to the tracked one then respond to it
    if (event.in_reply_to_status_id_str == this.trackingId) {

      const color = '#'+event.user.profile_link_color;

      // sanitise the text
      let text = event.text;
      text = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ');

      let directions = [];
      const words = text.split(' ');
      words.forEach((word) => {
        if (word == 'left' || word == 'l') {
          directions.push(3);
        }
        else if (word == 'up' || word == 'u') {
          directions.push(0);
        }
        else if (word == 'right' || word == 'r') {
          directions.push(1);
        }
        else if (word == 'down' || word == 'd') {
          directions.push(2);
        }
      });

      // send directions to maze to process
      this.maze.processDirections(directions, color);

      this.maze.draw();

      this.addToContributors(event);

      if (this.maze.path.complete) {
        this.mazeComplete();
        return;
      }

      this.sendReply(event);

      // const fs = require('fs');
      // fs.writeFile('out.png', this.canvas.toBuffer(), () => {});

    }
  }

  processError = (error) => {
    throw error;
  }


  // Initialisation and Completion
  //===================================

  newMaze() {
    // console.log('new maze');

    // reset contributors
    this.contributors = [];

    this.maze.draw();
    var imageId = this.uploadMedia(this.canvas.toBuffer().toString('base64'));
    if (imageId) {
      var tweetId = this.postTweet({
        status: 'Tweet me directions',
        mediaId: imageId
      }).id_str;
      this.trackingId = tweetId;
    }
  }

  mazeComplete() {
    // compose tweet string
    var status = 'Maze completed!';
    if (this.contributors.length != 0) {
      status += '\nThanks to ';
      // add this.contributors
      var i = 0;
      while (status.length <= 141 && i < this.contributors.length) {
        status += this.contributors[i] + ', ';
        i++;
      }
      // trim last 2 characters
      status = status.substring(0, status.length - 2);
      // if it's still longer than 140
      if (status.length > 140) {
        // remove the last username and its comma and space
        var trim = 2 + this.contributors[i - 1].length;
        // add an ellipses
        status = status.substring(0, status.length - trim) + '…';
      }
    }

    const imageId = this.uploadMedia(this.canvas.toBuffer().toString('base64'));
    var tweetData = this.postTweet({
      status: status,
      mediaId: imageId,
    });

    // reset and tweet
    this.maze.regenerate();
    this.newMaze();
  }


  // Replying
  //===================================

  addToContributors = (event) => {
    // add username to list of contributors
    if (this.contributors.indexOf('@' + event.user.screen_name) == -1) {
      this.contributors.push('@' + event.user.screen_name);
    }
  }

  sendReply = (event) => {
    const imageId = this.uploadMedia(this.canvas.toBuffer().toString('base64'));
    var tweetData = this.postTweet({
      status: '@' + event.user.screen_name,
      mediaId: imageId,
      replyId: event.id_str,
    });

    if (tweetData) {
      this.trackingId = tweetData.id_str;
    }
  }

  uploadMedia = (imageData) => {
    var ret;
    this.client.post('media/upload', { media_data: imageData }, function (error, data, response) {
      if (!error) {
        // console.log('media uploaded');
        ret = data.media_id_string;
      }
      else {
        // console.log('media not uploaded');
        ret = false;
      }
    });
    deasync.loopWhile(function () { return ret === undefined });
    return ret;
  }

  postTweet = (data) => {
    var ret;
    var tweetData = {
      status: data.status,
      media_ids: data.mediaId // Pass the media id string
    }

    // if it's in reponse to an id
    if (data.replyId) tweetData.in_reply_to_status_id = data.replyId;

    this.client.post('statuses/update', tweetData, function (error, data, response) {
      if (!error) {
        // console.log('tweeted');
        // return the data of successful tweet;
        ret = data;
      }
      else {
        // console.log('not tweeted');
        ret = false;
      }
    });
    deasync.loopWhile(function () { return ret === undefined });
    return ret;
  }

}

export default TwitterUtils;
