const out = console.log;

const COLOR_ALIVE = '#00FFFF';
const COLOR_DEAD = '#FFFFFF';
const CELL_SIZE = 40;
const GAME_SPEED = 600;

class Cell {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.renderX = x * CELL_SIZE;
    this.renderY = y * CELL_SIZE;
    this.ctx = ctx;
    this.isAlive = false;
  }
  render() {
    // set the correct color
    this.ctx.fillStyle = this.isAlive ? COLOR_ALIVE : COLOR_DEAD;
    // render
    this.ctx.fillRect(
      this.renderX,
      this.renderY,
      CELL_SIZE,
      CELL_SIZE
      );
  }
  toggle() {
    this.isAlive = !this.isAlive;
  }
  willBeAlive(cells) {
    let neighbors = cells.filter(cell => {
      // we are not our own neighbor
      if (cell === this) {
        return false;
      }
      // if we are one x square away and 1 or less y squares away
      if (Math.abs(this.x - cell.x) === 1) {
        if (Math.abs(this.y - cell.y) <= 1) {
          return true;
        }
      }
      // if we are one y square away and 1 or less x squares away
      if (Math.abs(this.y - cell.y) === 1) {
        if (Math.abs(this.x - cell.x) <= 1) {
          return true;
        }
      }
      // else return false
      return false;
    });
    // only live cells count
    neighbors = neighbors.filter(cell => cell.isAlive);
    // different branches for our states
    if (this.isAlive) {
      if (neighbors.length < 2) {
        return false;
      }
      else if (neighbors.length > 3) {
        return false;
      }
      else {
        return true;
      }
    } 
    else {
      if (neighbors.length === 3) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}

function main() {
  const canvas = document.getElementById('life-game');
  const ctx = canvas.getContext('2d');
  // create the cells
  // TODO: Make this work with irregular input
  let cells = [];
  const cellsPerSide = 400 / CELL_SIZE;
  for (let i = 0; i < cellsPerSide; i++) {
    for (let j = 0; j < cellsPerSide; j++) {
      let cell = new Cell(i, j, ctx);
      cell.render();
      cells.push(cell);
    }
  }
  // init click handling
  canvas.addEventListener('click', event => {
    let x = event.layerX;
    let y = event.layerY;
    // find the cell the user clicked on
    let matchX = cells.filter(cell => {
      return cell.renderX <= x && x <= (cell.renderX + CELL_SIZE);
    });
    let matchY = matchX.filter(cell => {
      return cell.renderY <= y && y <= (cell.renderY + CELL_SIZE);
    });
    // only one match should be remaining
    let clickedCell = matchY[0];
    clickedCell.toggle();
    clickedCell.render();
  });
  let gameIsRunning = false;
  // main game loop
  setInterval(() => {
    if (gameIsRunning) {
      out('Simulating generation');
      // update all cells
      cells.forEach(cell => cell.render());
      // get cells that will be alive next turn
      let willBeAlive = cells.filter(cell => cell.willBeAlive(cells));
      // get cells that wont be alive
      let willBeDead = cells.filter(cell => !willBeAlive.includes(cell));
      // update states
      willBeAlive.forEach(cell => cell.isAlive = true);
      willBeDead.forEach(cell => cell.isAlive = false);
    }
  }, GAME_SPEED);
  // start and stop the game
  const ctlButton = document.getElementById('ctl-button');
  ctlButton.addEventListener('click', () => {
    if (gameIsRunning) {
      // stop the game
      ctlButton.innerText = 'start';
    }
    else {
      // start the game
      ctlButton.innerText = 'stop';
    }
    gameIsRunning = !gameIsRunning;
  })
}

window.onload = main;
