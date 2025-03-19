function parseRules(input) {
  const rules = new Map();
  const lines = input.trim().split('\n');

  for (const line of lines) {
    const [pattern, result] = line.split(' => ');

    // Store all possible rotations and flips of each pattern
    const patterns = getAllPatternVariations(pattern);
    const resultGrid = result.split('/');

    for (const p of patterns) {
      rules.set(p, resultGrid);
    }
  }

  return rules;
}

function getAllPatternVariations(pattern) {
  const grid = pattern.split('/');
  const size = grid.length;
  const patterns = new Set();

  // Helper function to convert grid to string pattern
  const gridToPattern = (g) => g.join('/');

  // Original pattern
  let currentGrid = [...grid];
  patterns.add(gridToPattern(currentGrid));

  // 3 rotations
  for (let r = 0; r < 3; r++) {
    currentGrid = rotateGrid(currentGrid);
    patterns.add(gridToPattern(currentGrid));
  }

  // Flip and get rotations again
  currentGrid = flipGrid([...grid]);
  patterns.add(gridToPattern(currentGrid));

  for (let r = 0; r < 3; r++) {
    currentGrid = rotateGrid(currentGrid);
    patterns.add(gridToPattern(currentGrid));
  }

  return [...patterns];
}

function rotateGrid(grid) {
  const size = grid.length;
  const rotated = new Array(size).fill(0).map(() => '');

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x] = rotated[x] + grid[size - y - 1][x];
    }
  }

  return rotated;
}

function flipGrid(grid) {
  return grid.map(row => row.split('').reverse().join(''));
}

function splitGrid(grid) {
  const size = grid.length;
  const subgrids = [];

  const divisor = size % 2 === 0 ? 2 : 3;
  const subgridCount = size / divisor;

  for (let y = 0; y < subgridCount; y++) {
    for (let x = 0; x < subgridCount; x++) {
      const subgrid = [];

      for (let i = 0; i < divisor; i++) {
        const row = grid[y * divisor + i].substring(x * divisor, (x + 1) * divisor);
        subgrid.push(row);
      }

      subgrids.push(subgrid);
    }
  }

  return subgrids;
}

function mergeGrids(subgrids, subgridSize, resultGridSize) {
  const gridSize = Math.sqrt(subgrids.length) * subgridSize;
  const merged = new Array(gridSize).fill('').map(() => '');
  const subgridsPerRow = Math.sqrt(subgrids.length);

  for (let sgY = 0; sgY < subgridsPerRow; sgY++) {
    for (let sgX = 0; sgX < subgridsPerRow; sgX++) {
      const subgrid = subgrids[sgY * subgridsPerRow + sgX];

      for (let y = 0; y < subgridSize; y++) {
        const rowIdx = sgY * subgridSize + y;
        merged[rowIdx] += subgrid[y];
      }
    }
  }

  return merged;
}

function processIterations(iterations, rules) {
  let grid = ['.#.', '..#', '###'];

  for (let i = 0; i < iterations; i++) {
    const subgrids = splitGrid(grid);
    const transformedSubgrids = [];

    for (const subgrid of subgrids) {
      const pattern = subgrid.join('/');
      if (!rules.has(pattern)) {
        throw new Error(`No rule found for pattern: ${pattern}`);
      }
      transformedSubgrids.push(rules.get(pattern));
    }

    const subgridSize = transformedSubgrids[0].length;
    grid = mergeGrids(transformedSubgrids, subgridSize, Math.sqrt(transformedSubgrids.length) * subgridSize);
  }

  return grid;
}

function countOnPixels(grid) {
  return grid.join('').split('').filter(pixel => pixel === '#').length;
}

function solve(input, iterations) {
  const rules = parseRules(input);
  const finalGrid = processIterations(iterations, rules);
  return countOnPixels(finalGrid);
}

// For file reading in node.js environment
function readInputFromFile(filePath) {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
}

// Example usage
const input = readInputFromFile('inputDay21.txt');
console.log(`Part 1: ${solve(input, 5)}`);
console.time('Execution Time');
console.log(`Part 2: ${solve(input, 18)}`);
console.timeEnd('Execution Time');
