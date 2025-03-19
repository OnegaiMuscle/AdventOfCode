const fs = require('fs');

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

// Rotate a grid 90 degrees clockwise
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

// Flip a grid horizontally
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

// Split the grid into subgrids of the given size
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

// Join subgrids into a single grid
function joinGrids(subgrids, size) {
    const numSubgrids = Math.sqrt(subgrids.length);
    const subgridSize = subgrids[0].length;
    const gridSize = numSubgrids * subgridSize;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill('.'));

    for (let i = 0; i < subgrids.length; i++) {
        const gridX = (i % numSubgrids) * subgridSize;
        const gridY = Math.floor(i / numSubgrids) * subgridSize;

        for (let y = 0; y < subgridSize; y++) {
            for (let x = 0; x < subgridSize; x++) {
                grid[gridY + y][gridX + x] = subgrids[i][y][x];
            }
        }
    }

    return grid;
}

// Enhance the image for a given number of iterations
function enhanceImage(initialGrid, rules, iterations) {
    let grid = initialGrid;

    for (let i = 0; i < iterations; i++) {
        const size = grid.length;
        const subgridSize = (size % 2 === 0) ? 2 : 3;
        const subgrids = splitGrid(grid, subgridSize);
        const enhancedSubgrids = subgrids.map(subgrid => {
            const key = subgrid.map(row => row.join('')).join('/');
            return rules[key];
        });
        grid = joinGrids(enhancedSubgrids, subgridSize + 1);
    }

    return countOnPixels(grid);
}

// Count the number of "on" pixels in the grid
function countOnPixels(grid) {
    return grid.flat().filter(cell => cell === '#').length;
}

// Main execution
function main() {
    const filename = 'inputDay21.txt'; // Replace with your input file name
    const rules = parseAndPrecomputeRules(filename);

    const initialGrid = [
        ['.', '#', '.'],
        ['.', '.', '#'],
        ['#', '#', '#']
    ];

    // Part 1: Pixels on after 5 iterations
    const iterationsPart1 = 5;
    const resultPart1 = enhanceImage(initialGrid, rules, iterationsPart1);
    console.log(`The number of pixels that stay on after ${iterationsPart1} iterations is: ${resultPart1}`);

    // Part 2: Pixels on after 18 iterations
    const iterationsPart2 = 18;
    const resultPart2 = enhanceImage(initialGrid, rules, iterationsPart2);
    console.log(`The number of pixels that stay on after ${iterationsPart2} iterations is: ${resultPart2}`);
}

// Execute the main function
main();
