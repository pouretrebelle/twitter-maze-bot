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

    const m = this.maze;

    c.fillStyle = m.wallColor;
    c.save();
    c.translate(this.x * m.size, this.y * m.size);
    if (this.vert) {
      c.rotate(Math.PI * 0.5);
    }

    // main wall
    c.fillRect(
      m.wallBorderRadius - m.wallWidth * 0.5,
      -m.wallWidth * 0.5,
      m.size - m.wallBorderRadius * 2 + m.wallWidth,
      m.wallWidth
    );

    let curveStart = false;
    let curveEnd = false;

    if (!curveStart) {
      this.drawCap(c);
    }

    c.translate(m.size, 0);
    c.rotate(Math.PI);

    if (!curveEnd) {
      this.drawCap(c);
    }

    c.restore();
  }

  drawCap(c) {
    const m = this.maze;

    c.beginPath();
    c.moveTo(
      m.wallBorderRadius - m.wallWidth * 0.5,
      -m.wallWidth * 0.5,
    );
    c.lineTo(
      m.wallBorderRadius - m.wallWidth * 0.5,
      m.wallWidth * 0.5,
    );
    c.lineTo(
      0,
      m.wallWidth * 0.5,
    );
    c.arcTo(
      -m.wallWidth * 0.5,
      m.wallWidth * 0.5,
      -m.wallWidth * 0.5,
      0,
      m.wallWidth * 0.5
    );
    c.arcTo(
      -m.wallWidth * 0.5,
      -m.wallWidth * 0.5,
      0,
      -m.wallWidth * 0.5,
      m.wallWidth * 0.5
    );
    c.fill();
  }
}

export default MazeEdge;
