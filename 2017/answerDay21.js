const fs = require('fs');

// Function to parse enhancement rules from a text file
function parseRules(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const rules = {};

    data.trim().split('\n').forEach(line => {
        const [input, output] = line.split(' => ');
        rules[input] = output.split('/').map(row => row.split(''));
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

// Generate all transformations of a grid (rotations and flips)
function generateTransformations(grid) {
    const transformations = [];
    let current = grid;

    for (let i = 0; i < 4; i++) {
        transformations.push(current); // Original and rotated
        transformations.push(flip(current)); // Flipped version
        current = rotate(current); // Rotate for next iteration
    }

    return transformations;
}

// Function to match a subgrid to a rule and enhance it
function enhanceSubgrid(subgrid, rules) {
    const transformations = generateTransformations(subgrid);
    for (let transformed of transformations) {
        const key = transformed.map(row => row.join('')).join('/');
        if (rules[key]) {
            return rules[key];
        }
    }
    throw new Error('No matching rule found for subgrid!');
}

// Function to split the grid into subgrids
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

// Function to join subgrids into a single grid
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

// Function to count the number of "on" pixels in the grid
function countOnPixels(grid) {
    return grid.flat().filter(cell => cell === '#').length;
}

// Main function to enhance the image for a given number of iterations
function enhanceImage(initialGrid, rules, iterations) {
    let grid = initialGrid;

    for (let i = 0; i < iterations; i++) {
        const size = grid.length;
        const subgridSize = (size % 2 === 0) ? 2 : 3;
        const subgrids = splitGrid(grid, subgridSize);
        const enhancedSubgrids = subgrids.map(subgrid => enhanceSubgrid(subgrid, rules));
        grid = joinGrids(enhancedSubgrids, subgridSize + 1);
    }

    return countOnPixels(grid);
}

// Main execution
function main() {
    const filename = 'inputDay21.txt'; // Replace with your input file name
    const rules = parseRules(filename);

    const initialGrid = [
        ['.', '#', '.'],
        ['.', '.', '#'],
        ['#', '#', '#']
    ];

    // Part 1: How many pixels are on after 5 iterations
    const iterationsPart1 = 5;
    const resultPart1 = enhanceImage(initialGrid, rules, iterationsPart1);
    console.log(`The number of pixels that stay on after ${iterationsPart1} iterations is: ${resultPart1}`);

    // Part 2: How many pixels are on after 18 iterations
    const iterationsPart2 = 18;
    const resultPart2 = enhanceImage(initialGrid, rules, iterationsPart2);
    console.log(`The number of pixels that stay on after ${iterationsPart2} iterations is: ${resultPart2}`);
}

// Execute the main function
main();
