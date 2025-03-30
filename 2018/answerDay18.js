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

  const seen = new Map();
  let cycleStart = null, cycleLength = null;

  for (let minute = 0; minute < minutes; minute++) {
      const key = area.map(row => row.join('')).join('\n');
      if (seen.has(key)) {
          cycleStart = seen.get(key);
          cycleLength = minute - cycleStart;
          break;
      }
      seen.set(key, minute);

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

  if (cycleStart !== null && cycleLength !== null) {
      const remainingMinutes = (minutes - cycleStart) % cycleLength;
      for (let minute = 0; minute < remainingMinutes; minute++) {
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
const minutesPart1 = 10;
const minutesPart2 = 1000000000;

// Part 1: Resource value after 10 minutes
const areaPart1 = simulateLandscape(area, minutesPart1);
console.log('Resource Value after 10 minutes:', calculateResourceValue(areaPart1));

// Part 2: Resource value after 1 billion minutes
const areaPart2 = simulateLandscape(area, minutesPart2);
console.log('Resource Value after 1 billion minutes:', calculateResourceValue(areaPart2));
