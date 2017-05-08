class MazeUnit {
  constructor(x, y, maze) {
    this.x = x;
    this.y = y;
    this.maze = maze;

    // establish neighbours
    this.neighbours = [];
    this.edges = [];

    this.active = false;
  }

  initialiseNeighbours(x, y) {
    // initialise neighbours called after all hexagons are constructed
    // because otherwise the hexagons array isn't full yet
    // lots of conditionals to allow for edge hexagons

    // start with array of falses for neighbours
    // and empty for edges
    let e = [false, false, false, false];
    let n = [false, false, false, false];

    // north
    if (y > 0) {
      n[0] = this.maze.units[x][y - 1];
      e[0] = this.maze.edges[x * 2][y];
    }

    // east
    if (x < this.maze.unitsX - 1) {
      n[1] = this.maze.units[x + 1][y];
      e[1] = this.maze.edges[x * 2 + 3][y];
    }

    // south
    if (y < this.maze.unitsY - 1) {
      n[2] = this.maze.units[x][y + 1];
      e[2] = this.maze.edges[x * 2][y + 1];
    }

    // west
    if (x > 0) {
      n[3] = this.maze.units[x - 1][y];
      e[3] = this.maze.edges[x * 2 + 1][y];
    }

    this.neighbours = n;
    this.edges = e;
  }

  update() {
  }

  draw(c) {
    c.fillRect(this.x * this.maze.size, this.y * this.maze.size, this.maze.size, this.maze.size);
  }

  activate() {
    this.active = true;
  }

  countWalls() {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (this.edges[i].active) count++;
    }
    return count;
  }

  countInactiveNeighbours() {
    // returns number of inactive neighbours
    let inactiveNeighbours = 0;
    for (let i = 0; i < 4; i++) {
      if (this.neighbours[i] && !this.neighbours[i].active) {
        inactiveNeighbours++;
      }
    }
    return inactiveNeighbours;
  }

  getInactiveNeighbours() {
    // returns array of booleans for inactive neighbours
    let inactiveNeighbours = [];
    for (let i = 0; i < 4; i++) {
      // if neighbour exists and is inactive
      if (this.neighbours[i] && !this.neighbours[i].active) {
        inactiveNeighbours.push(true);
      } else {
        inactiveNeighbours.push(false);
      }
    }
    return inactiveNeighbours;
  }

  getRandomInactiveNeighbour() {
    let count = this.countInactiveNeighbours();
    if (count == 0) return false;
    let choice = Math.floor(Math.random() * count);
    let inactives = this.getInactiveNeighbours();
    let through = 0;
    for (let i = 0; i < 4; i++) {
      if (inactives[i]) {
        if (through == choice) {
          return i;
        }
        through++;
      }
    }
  }

  getActiveNeighbour() {
    for (let i = 0; i < 4; i++) {
      if (this.neighbours[i].active) {
        return i;
      }
    }
  }

  getEdge(neighbour) {
    if (!neighbour) return false;
    let diffX = this.x - neighbour.x;
    let diffY = this.y - neighbour.y;
    if (diffX == 1) {
      return this.edges[3];
    }
    else if (diffX == -1) {
      return this.edges[1];
    }
    else if (diffY == 1) {
      return this.edges[2];
    }
    else if (diffY == -1) {
      return this.edges[0];
    }
    return false;
  }
}

export default MazeUnit;
