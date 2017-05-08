class MazeEdge {
  constructor(x, y, maze) {
    this.maze = maze;
    this.vert = false;
    if (x % 2 == 0) this.vert = true;

    this.x = Math.floor(x / 2);
    this.y = y;
    this.active = true;

    // disable off the edges
    if (x == this.maze.unitsX * 2) this.active = false;
    if (y == this.maze.unitsY && x % 2) this.active = false;
  }

  deactivate() {
    this.active = false;
  }

  draw(c) {
    if (!this.active) return;

    c.strokeStyle = this.maze.wallColor;
    c.beginPath();
    c.moveTo(this.x * this.maze.size, this.y * this.maze.size);
    if (this.vert) {
      c.lineTo((this.x + 1) * this.maze.size, this.y * this.maze.size);
    }
    else {
      c.lineTo(this.x * this.maze.size, (this.y + 1) * this.maze.size);
    }
    c.closePath();
    c.stroke();
  }
}

export default MazeEdge;
