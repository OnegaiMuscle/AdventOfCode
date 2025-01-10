function createGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
      grid.push(new Array(size).fill(false));
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
              grid[i][j] = true;
          } else if (action === 'off') {
              grid[i][j] = false;
          } else if (action === 'toggle') {
              grid[i][j] = !grid[i][j];
          }
      }
  }
}

function countLights(grid) {
  let count = 0;
  for (let row of grid) {
      for (let light of row) {
          if (light) count++;
      }
  }
  return count;
}

const fs = require('fs');
const instructions = fs.readFileSync('inputDay06.txt', 'utf8').trim().split('\n');


const grid = createGrid(1000);

for (let instruction of instructions) {
  applyInstruction(grid, instruction);
}

console.log(countLights(grid)); // Output: 998996
