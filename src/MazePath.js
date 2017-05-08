import MazePathSegment from './MazePathSegment';

class MazePath {
  constructor(maze) {
    this.maze = maze;
    this.complete = false;
    this.pathColor = '#6f767b';
    this.originalPathColor = this.pathColor;
    this.pathWidth = 6;
    this.pathHeadSize = 14;
    this.segments = [];

    this.addToPath(0, 0, this.pathColor);
  }

  addToPath(x, y, color) {
    this.active = false;

    let next = this.maze.units[x][y];
    let segment = new MazePathSegment(this.last(), next, color, this.maze);
    this.segments.push(segment);

    // if it's the first addition, change the path color
    if (this.segments.length == 2) {
      this.pathColor.set(this.segments[1].color);
    }
  }

  last() {
    // if there are segments
    if (this.segments.length > 0) {
      // return the 'end' of the last one
      return this.segments[this.segments.length - 1].end;
    }
    // otherwise return the origin
    return this.maze.units[0][0];
  }

  draw(c) {

    c.fillStyle = this.pathColor;
    c.lineWidth = this.pathWidth;

    // draw start of path
    c.fillRect(
      -this.maze.size,
      0.5 * this.maze.size - this.pathWidth * 0.5,
      1.5 * this.maze.size,
      this.pathWidth
    );

    // draw end of path if it's finished
    if (this.complete) {
      // set the colour to the last segment
      c.fillStyle = this.segments[this.segments.length].color;
      c.fillRect(
        (this.maze.unitsX - 0.5) * this.maze.size,
        (this.maze.unitsY - 0.5) * this.maze.size - this.pathWidth * 0.5,
        1.5 * this.maze.size,
        this.pathWidth
      );
    }

    // draw each segment of path
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(c, this.pathWidth);
    }

    // draw ball at the end of path
    if (!this.complete) {
      let end = this.last();
      c.beginPath();
      c.arc(
        (end.x + 0.5) * this.maze.size,
        (end.y + 0.5) * this.maze.size,
        this.pathHeadSize * 0.5,
        0,
        Math.TWO_PI
      );
      c.fill();
    }

  }
}

export default MazePath;
