import MazeUnit from './MazeUnit';
import MazeEdge from './MazeEdge';

class Maze {
  constructor(w, unitsX, unitsY, margin, wallWidth, wallBorderRadius, wallColor, backgroundColor) {

    // assign variables
    this.w = w;
    this.unitsX = unitsX;
    this.unitsY = unitsY;
    this.size = w / unitsX;
    this.h = unitsY * this.size;
    this.margin = margin;
    this.wallWidth = wallWidth;
    this.wallBorderRadius = wallBorderRadius;
    this.wallColor = wallColor;
    this.backgroundColor = backgroundColor;

    // initialise units and edges as arrays of arrays
    this.units = Array.from({ length: this.unitsX + 1 }, () => []);
    this.edges = Array.from({ length: this.unitsX * 2 + 3 }, () => []);

    // make a load of walls
    this.setupWalls();

    // make a load of units that reference those walls
    this.setupUnits();

    // use algorithm to carve walls
    this.huntAndKill();

    // setup maze path
    // mazePath.setup(&mazeUnits, mazeUnitPositions, unitsX, unitsY);
  }


  // Carving methods
  //===================================

  setupWalls() {
    // initialise 2D array of edges
    for (let x = 0; x <= this.unitsX * 2 + 1; x++) {
      for (let y = 0; y <= this.unitsY; y++) {
        this.edges[x].push(new MazeEdge(x, y, this));
      }
    }
  }

  setupUnits() {
    // initialise 2D array of units
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x].push(new MazeUnit(x, y, this));
      }
    }
    // neighbouring needs to be done after they're all initialised
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x][y].initialiseNeighbours(x, y);
      }
    }
  }


  // Carving algorithms
  //===================================

  huntAndKill() {
    let startUnit = this.units[Math.round(this.unitsX/2)][Math.round(this.unitsY/2)];
    while (startUnit != false) {
      this.kill(startUnit);
      startUnit = this.hunt();
    }

    // reset activity of units
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x][y].active = false;
      }
    }
  }

  kill(tile) {
    let curUnit = tile;
    curUnit.activate();
    // remove an active edge
    let prev = curUnit.getActiveNeighbour();
    let prevEdge = curUnit.edges[prev];
    if (prevEdge) prevEdge.deactivate();
    // find a next tile
    let next = curUnit.getRandomInactiveNeighbour();
    let nextUni = curUnit.neighbours[next];
    while (nextUni != undefined) {
      nextUni.activate();
      curUnit.edges[next].deactivate();
      curUnit = nextUni;
      next = curUnit.getRandomInactiveNeighbour();
      nextUni = curUnit.neighbours[next];
    }
  }

  hunt() {
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        let unit = this.units[x][y];
        let maxNeighbours = 4;
        if (x == 0 || x == this.unitsX - 1) maxNeighbours--;
        if (y == 0 || y == this.unitsY - 1) maxNeighbours--;
        if (!unit.active && unit.countInactiveNeighbours() < maxNeighbours) {
          return unit;
        }
      }
    }
    return false;
  }


  // Drawing methods
  //===================================

  draw(c) {

    for (let x = 0; x <= this.unitsX * 2 + 1; x++) {
      for (let y = 0; y <= this.unitsY; y++) {
        this.edges[x][y].draw(c);
      }
    }
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        // this.units[x][y].draw(c);
      }
    }
  }

}

export default Maze;
