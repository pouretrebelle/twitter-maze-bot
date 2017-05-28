import { outlineArc } from './utils';

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
    // entrance
    if (this.vert && this.x == 0 && this.y == this.maze.entranceY) this.active = false;
    // exit
    if (this.vert && this.x == this.maze.unitsX && this.y == this.maze.exitY) this.active = false;
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

  checkRelativeEdge(x, y) {
    const targetX = this.vert ? this.x*2+1+x : this.x*2+x;
    const targetY = this.y + y;
    let curve = false;
    if (this.maze.edges[targetX] &&
        this.maze.edges[targetX][targetY] &&
        this.maze.edges[targetX][targetY].canDraw()) {
      curve = true;
    }
    return curve;
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

    let curveStartLeft = this.vert ? this.checkRelativeEdge(-3, 0) : this.checkRelativeEdge(1, 0);
    let curveEndLeft = this.vert ? this.checkRelativeEdge(-1, 1) : this.checkRelativeEdge(3, -1);

    let curveStartRight = this.vert ? this.checkRelativeEdge(-1, 0) : this.checkRelativeEdge(1, -1);
    let curveEndRight = this.vert ? this.checkRelativeEdge(-3, 1) : this.checkRelativeEdge(3, 0);

    if (curveStartLeft && curveStartRight) this.drawCurveWithT(c);
    else if (curveStartLeft) this.drawCurve(c);
    else if (!curveStartRight) this.drawCap(c);

    c.translate(m.size, 0);
    c.rotate(Math.PI);

    if (curveEndLeft && curveEndRight) this.drawCurveWithT(c);
    else if (curveEndLeft) this.drawCurve(c);
    else if (!curveEndRight) this.drawCap(c);

    c.restore();
  }

  drawCurve(c) {
    outlineArc(
      c,
      this.maze.wallBorderRadius - this.maze.wallWidth * 0.5,
      this.maze.wallBorderRadius - this.maze.wallWidth * 0.5,
      this.maze.wallBorderRadius,
      this.maze.wallBorderRadius - this.maze.wallWidth,
      Math.PI
    );
  }

  drawCurveWithT(c) {
    this.drawCurve(c);
    c.beginPath();
    c.moveTo(-this.maze.wallWidth * 0.5, this.maze.wallBorderRadius);
    c.arcTo(-this.maze.wallWidth * 0.5, 0, this.maze.wallBorderRadius - this.maze.wallWidth * 0.5, 0, this.maze.wallBorderRadius);
    c.arcTo(-this.maze.wallWidth * 0.5, 0, -this.maze.wallWidth * 0.5, -this.maze.wallBorderRadius, this.maze.wallBorderRadius);
    c.lineTo(-this.maze.wallWidth * 0.5, -this.maze.wallBorderRadius);
    c.fill();
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
