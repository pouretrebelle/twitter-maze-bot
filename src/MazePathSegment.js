class MazePathSegment {
  constructor(start, end, color, maze) {
    this.maze = maze;
    this.start = start;
    this.end = end;
    this.color = color;
  }

  draw(c, pathWidth) {
    // always start with the top/left side
    // to avoid complication of negative w/h
    c.fillStyle = this.color;
    if (this.start.x > this.end.x || this.start.y > this.end.y) {
      c.fillRect(
        (this.end.x + 0.5) * this.maze.size - pathWidth * 0.5,
        (this.end.y + 0.5) * this.maze.size - pathWidth * 0.5,
        (this.start.x - this.end.x) * this.maze.size + pathWidth,
        (this.start.y - this.end.y) * this.maze.size + pathWidth
      );
    }
    else {
      c.fillRect(
        (this.start.x + 0.5) * this.maze.size - pathWidth * 0.5,
        (this.start.y + 0.5) * this.maze.size - pathWidth * 0.5,
        (this.end.x - this.start.x) * this.maze.size + pathWidth,
        (this.end.y - this.start.y) * this.maze.size + pathWidth
      );
    }
  }
}

export default MazePathSegment;
