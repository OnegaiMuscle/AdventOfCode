
// Function to parse input from a text file
function parseInput(filename) {
  const fs = require('fs');
  const input = fs.readFileSync(filename, 'utf-8').trim();
  return input.split('\n').map(line => line.split(''));
}

// Function to simulate the changes
function simulateLandscape(area, minutes) {
  const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
  ];

  const rows = area.length;
  const cols = area[0].length;

  const countAdjacent = (x, y, target) => {
      let count = 0;
      for (const [dx, dy] of directions) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && area[nx][ny] === target) {
              count++;
          }
      }
      return count;
  };

  for (let minute = 0; minute < minutes; minute++) {
      const newArea = area.map(row => [...row]);
      for (let x = 0; x < rows; x++) {
          for (let y = 0; y < cols; y++) {
              const cell = area[x][y];
              const trees = countAdjacent(x, y, '|');
              const lumberyards = countAdjacent(x, y, '#');

              if (cell === '.' && trees >= 3) {
                  newArea[x][y] = '|';
              } else if (cell === '|' && lumberyards >= 3) {
                  newArea[x][y] = '#';
              } else if (cell === '#' && !(lumberyards >= 1 && trees >= 1)) {
                  newArea[x][y] = '.';
              }
          }
      }
      area = newArea;
  }

  return area;
}

// Function to calculate resource value
function calculateResourceValue(area) {
  let wooded = 0, lumberyards = 0;
  for (const row of area) {
      for (const cell of row) {
          if (cell === '|') wooded++;
          if (cell === '#') lumberyards++;
      }
  }
  return wooded * lumberyards;
}

// Example usage
const area = parseInput('inputDay18.txt'); // Replace 'input.txt' with the path to your text file
const minutes = 10;
const finalArea = simulateLandscape(area, minutes);
console.log('Resource Value:', calculateResourceValue(finalArea));
