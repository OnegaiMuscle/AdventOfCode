function parseGrid(input) {
  return input.trim().split('\n').map(line => line.split(''));
}

function countNeighbors(grid, x, y) {
  const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1]
  ];
  let count = 0;
  for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
          if (grid[nx][ny] === '#') {
              count++;
          }
      }
  }
  return count;
}

function animateGrid(grid, steps) {
  for (let step = 0; step < steps; step++) {
      const newGrid = grid.map(row => row.slice());
      for (let x = 0; x < grid.length; x++) {
          for (let y = 0; y < grid[0].length; y++) {
              const neighbors = countNeighbors(grid, x, y);
              if (grid[x][y] === '#') {
                  if (neighbors !== 2 && neighbors !== 3) {
                      newGrid[x][y] = '.';
                  }
              } else {
                  if (neighbors === 3) {
                      newGrid[x][y] = '#';
                  }
              }
          }
      }
      grid = newGrid;
  }
  return grid;
}

function countLightsOn(grid) {
  return grid.flat().filter(light => light === '#').length;
}

const fs = require('fs');

function parseGrid(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const grid = data.trim().split('\n').map(line => line.split(''));
    return grid;
}

const filePath = 'inputDay18.txt';



const grid = parseGrid(filePath);
const steps = 100;
const finalGrid = animateGrid(grid, steps);
const lightsOn = countLightsOn(finalGrid);
console.log('Number of lights on after 100 steps:', lightsOn);
