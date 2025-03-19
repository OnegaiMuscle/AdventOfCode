// Import necessary modules
const { Worker } = require('worker_threads');
const fs = require('fs');
const path = require('path');

// Parse rules from the input file and precompute transformations
function parseAndPrecomputeRules(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const rules = {};

    data.trim().split('\n').forEach(line => {
        const [input, output] = line.split(' => ');
        const inputGrid = input.split('/').map(row => row.split(''));
        const outputGrid = output.split('/').map(row => row.split(''));

        // Generate all transformations for the input grid
        const transformations = generateTransformations(inputGrid);
        transformations.forEach(transformation => {
            const key = transformation.map(row => row.join('')).join('/');
            rules[key] = outputGrid; // Map all transformations to the output
        });
    });

    return rules;
}

// Function to rotate a grid 90 degrees clockwise
function rotate(grid) {
    const size = grid.length;
    const newGrid = Array.from({ length: size }, () => Array(size).fill('.'));
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            newGrid[x][size - y - 1] = grid[y][x];
        }
    }
    return newGrid;
}

// Function to flip a grid horizontally
function flip(grid) {
    return grid.map(row => row.slice().reverse());
}

// Generate all transformations (rotations and flips) of a grid
function generateTransformations(grid) {
    const transformations = [];
    let current = grid;

    for (let i = 0; i < 4; i++) {
        transformations.push(current); // Add the current rotation
        transformations.push(flip(current)); // Add the flipped version
        current = rotate(current); // Rotate for next iteration
    }

    return transformations;
}

// Function to split the grid into subgrids of the given size
function splitGrid(grid, size) {
  const subgrids = [];
  const n = grid.length;

  for (let y = 0; y < n; y += size) {
      for (let x = 0; x < n; x += size) {
          const subgrid = [];
          for (let i = 0; i < size; i++) {
              subgrid.push(grid[y + i].slice(x, x + size));
          }
          subgrids.push(subgrid);
      }
  }

  return subgrids;
}



// Main function to run the enhancement process using Web Workers
async function enhanceImageUsingWorkers(initialGrid, rules, iterations) {
    let grid = initialGrid;

    for (let i = 0; i < iterations; i++) {
        const size = grid.length;
        const subgridSize = (size % 2 === 0) ? 2 : 3;
        const numWorkers = 8; // Adjust number of workers as needed
        const subgrids = splitGrid(grid, subgridSize);

        // Divide subgrids among workers
        const promises = [];
        const chunkSize = Math.ceil(subgrids.length / numWorkers);

        for (let j = 0; j < numWorkers; j++) {
            const workerData = {
                subgrids: subgrids.slice(j * chunkSize, (j + 1) * chunkSize),
                rules
            };

            promises.push(runWorker(workerData));
        }

        const enhancedSubgrids = (await Promise.all(promises)).flat();
        grid = joinGrids(enhancedSubgrids, subgridSize + 1);
    }

    return countOnPixels(grid);
}

// Function to join subgrids into a single grid
function joinGrids(subgrids, size) {
  const numSubgrids = Math.sqrt(subgrids.length); // Determine how many subgrids fit along one side
  const subgridSize = subgrids[0].length; // The size of each subgrid
  const gridSize = numSubgrids * subgridSize; // Calculate the size of the full grid
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('.')); // Initialize the grid

  for (let i = 0; i < subgrids.length; i++) {
      const gridX = (i % numSubgrids) * subgridSize; // X-coordinate for subgrid placement
      const gridY = Math.floor(i / numSubgrids) * subgridSize; // Y-coordinate for subgrid placement

      for (let y = 0; y < subgridSize; y++) {
          for (let x = 0; x < subgridSize; x++) {
              grid[gridY + y][gridX + x] = subgrids[i][y][x]; // Place the subgrid in the appropriate position
          }
      }
  }

  return grid;
}

// Helper to run Web Worker
function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'workerDay21.js'), { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

// Count the number of "on" pixels in the grid
function countOnPixels(grid) {
    return grid.flat().filter(cell => cell === '#').length;
}

// Main execution
async function main() {
    const filename = 'inputDay21.txt'; // Replace with your input file name
    const rules = parseAndPrecomputeRules(filename);

    const initialGrid = [
        ['.', '#', '.'],
        ['.', '.', '#'],
        ['#', '#', '#']
    ];

    // Part 1: Pixels on after 5 iterations
    const iterationsPart1 = 5;
    const resultPart1 = await enhanceImageUsingWorkers(initialGrid, rules, iterationsPart1);
    console.log(`The number of pixels that stay on after ${iterationsPart1} iterations is: ${resultPart1}`);

    // Part 2: Pixels on after 18 iterations
    const iterationsPart2 = 18;
    const resultPart2 = await enhanceImageUsingWorkers(initialGrid, rules, iterationsPart2);
    console.log(`The number of pixels that stay on after ${iterationsPart2} iterations is: ${resultPart2}`);
}

// Execute the main function
main();
