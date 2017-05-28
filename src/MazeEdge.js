class MazeEdge {
  constructor(x, y, maze) {
    this.maze = maze;
    this.vert = false;
    if (x % 2 == 1) this.vert = true;

    this.x = Math.floor(x / 2);
    this.y = y;
    this.active = true;
    this.disabled = false;

    // bottom
    if (this.vert && this.y == this.maze.unitsY) this.disabled = true;
    // right
    if (!this.vert && this.x == this.maze.unitsX) this.disabled = true;
    // top left
    if (this.vert && this.x == 0 && this.y == 0) this.disabled = true;
    // bottom right
    if (this.vert && this.x == this.maze.unitsX && this.y == this.maze.unitsY - 1) this.disabled = true;
  }

  deactivate() {
    this.active = false;
  }

  cantDraw() {
    return (!this.active || this.disabled);
  }

  canDraw() {
    return (this.active && !this.disabled);
  }

  extendThroughNextEdge() {
    if (this.vert && this.maze.edges[this.x * 2 + 1][this.y + 1].cantDraw() ||
      !this.vert && this.maze.edges[this.x * 2 + 2][this.y].cantDraw()) {
      return false;
    }
    return true;
  }

  draw(c) {
    if (this.cantDraw()) return;

    const extendWall = this.extendThroughNextEdge();
    let wallLength = extendWall ? this.maze.size : this.maze.size - this.maze.wallBorderRadius * 2 + this.maze.wallWidth;

    c.fillStyle = this.maze.wallColor;
    c.save();
    c.translate(this.x * this.maze.size, this.y * this.maze.size);

    if (this.vert) {
      c.beginPath();
      // cap start
      c.arc(
        0,
        this.maze.wallBorderRadius - this.maze.wallWidth*0.5,
        this.maze.wallWidth*0.5,
        0,
        Math.PI*2
      );
      if (!extendWall) {
        // cap end
        c.arc(
          0,
          this.maze.wallBorderRadius + wallLength - this.maze.wallWidth*0.5,
          this.maze.wallWidth * 0.5,
          0,
          Math.PI * 2
        );
      }
      c.fill();
      c.fillRect(
        -this.maze.wallWidth * 0.5,
        this.maze.wallBorderRadius - this.maze.wallWidth*0.5,
        this.maze.wallWidth,
        wallLength
      );
    }

    else {
      c.beginPath();
      // cap start
      c.arc(
        this.maze.wallBorderRadius - this.maze.wallWidth*0.5,
        0,
        this.maze.wallWidth * 0.5,
        0,
        Math.PI * 2
      );
      if (!extendWall) {
        // cap end
        c.arc(
          this.maze.wallBorderRadius + wallLength - this.maze.wallWidth*0.5,
          0,
          this.maze.wallWidth * 0.5,
          0,
          Math.PI * 2
        );
      }
      c.fill();
      c.fillRect(
        this.maze.wallBorderRadius - this.maze.wallWidth*0.5,
        -this.maze.wallWidth * 0.5,
        wallLength,
        this.maze.wallWidth
      );
    }

    c.restore();
  }
}

export default MazeEdge;
