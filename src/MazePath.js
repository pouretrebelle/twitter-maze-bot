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
      this.pathColor = this.segments[1].color;
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

  travel(direction, color) {
    // don't move if the path is complete
    if (this.complete) return;

    // get the end of the line
    let current = this.last();
    let hitJunction = false;

    // move until you hit a wall
    while (current.neighbours[direction] &&
           !current.edges[direction].active &&
           !hitJunction) {
      current = current.neighbours[direction];

      // if the new unit has fewer than 2 edges then you've hit a junction and should stop moving
      if (current.countWalls() != 2) {
        hitJunction = true;
      }
    }

    // if it has moved, add it to the path
    if (current != this.last()) {
      this.addToPath(current.x, current.y, color);
    }

    // if the current unit is the last one on the grid the maze is complete!
    if (current.x == this.maze.unitsX-1 && current.y == this.maze.unitsY-1 && direction == 1) {
      this.complete = true;
    }
  }

  reset() {
    this.complete = false;
    this.pathColor = this.originalPathColor;
    this.segments.splice(1);
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
      c.fillStyle = this.segments[this.segments.length - 1].color;
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
        2*Math.PI
      );
      c.fill();
    }

  }
}

export default MazePath;
