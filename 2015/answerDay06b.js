function createGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
      grid.push(new Array(size).fill(0));
  }
  return grid;
}

function applyInstruction(grid, instruction) {
  const parts = instruction.split(' ');
  let action, start, end;

  if (parts[0] === 'toggle') {
      action = 'toggle';
      start = parts[1];
      end = parts[3];
  } else {
      action = parts[1];
      start = parts[2];
      end = parts[4];
  }

  const [x1, y1] = start.split(',').map(Number);
  const [x2, y2] = end.split(',').map(Number);

  for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
          if (action === 'on') {
              grid[i][j] += 1;
          } else if (action === 'off') {
              grid[i][j] = Math.max(0, grid[i][j] - 1);
          } else if (action === 'toggle') {
              grid[i][j] += 2;
          }
      }
  }
}

function calculateTotalBrightness(grid) {
  let totalBrightness = 0;
  for (let row of grid) {
      for (let brightness of row) {
          totalBrightness += brightness;
      }
  }
  return totalBrightness;
}

const fs = require('fs');
const instructions = fs.readFileSync('inputDay06.txt', 'utf8').trim().split('\n');



const grid = createGrid(1000);

for (let instruction of instructions) {
  applyInstruction(grid, instruction);
}

console.log(calculateTotalBrightness(grid));
