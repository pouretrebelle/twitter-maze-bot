'use strict';

import Maze from './Maze';

const Canvas = require('canvas');
let canvas = new Canvas(1024, 512);
let c = canvas.getContext('2d');

// blank out background
c.fillStyle = '#fff';
c.fillRect(0, 0, 1024, 512);
// translate so maze draws in centre
c.translate(46.75, 52);

let maze = new Maze(930, 20, 9, 46, 6, 8, '#000', '#fff');
maze.draw(c);

const fs = require('fs');
fs.writeFile('out.png', canvas.toBuffer(), function() {
  process.exit();
});
