'use strict';
require('dotenv').config();

import Maze from './Maze';
import Twitter from './Twitter';


const Canvas = require('canvas');
let canvas = new Canvas(1024, 512);
let c = canvas.getContext('2d');

// blank out background
c.fillStyle = '#fff';
c.fillRect(0, 0, 1024, 512);
// translate so maze draws in centre
c.translate(46.75, 52);

let maze = new Maze(c, 930, 20, 9, 46, 6, 14, '#000', '#fff');
let twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
},
process.env.TWITTER_USERNAME,
canvas,
maze);
