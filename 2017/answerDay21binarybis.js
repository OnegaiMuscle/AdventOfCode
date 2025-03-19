const fs = require('fs');

// Convert a string pattern to a bitboard
function patternToBitboard(pattern) {
    const grid = pattern.split('/');
    let bitboard = 0n;
    const size = grid.length;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === '#') {
                bitboard |= 1n << BigInt(i * size + j);
            }
        }
    }
    return bitboard;
}

// Convert a bitboard to a pattern string
function bitboardToPattern(bitboard, size) {
    let result = [];
    for (let i = 0; i < size; i++) {
        let row = '';
        for (let j = 0; j < size; j++) {
            row += (bitboard & (1n << BigInt(i * size + j))) ? '#' : '.';
        }
        result.push(row);
    }
    return result.join('/');
}

// Rotate a bitboard 90 degrees clockwise
function rotate90(bitboard, size) {
    let result = 0n;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (bitboard & (1n << BigInt(i * size + j))) {
                result |= 1n << BigInt(j * size + (size - 1 - i));
            }
        }
    }
    return result;
}

// Flip a bitboard horizontally
function flipHorizontal(bitboard, size) {
    let result = 0n;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (bitboard & (1n << BigInt(i * size + j))) {
                result |= 1n << BigInt(i * size + (size - 1 - j));
            }
        }
    }
    return result;
}

// Generate all unique transformations of a pattern
function getAllTransformations(pattern) {
    const size = pattern.split('/').length;
    let bitboard = patternToBitboard(pattern);
    let transformations = new Set();

    // Add original pattern
    transformations.add(bitboardToPattern(bitboard, size));

    // Add rotations
    for (let i = 0; i < 3; i++) {
        bitboard = rotate90(bitboard, size);
        transformations.add(bitboardToPattern(bitboard, size));
    }

    // Flip and add rotations
    bitboard = flipHorizontal(patternToBitboard(pattern), size);
    transformations.add(bitboardToPattern(bitboard, size));

    for (let i = 0; i < 3; i++) {
        bitboard = rotate90(bitboard, size);
        transformations.add(bitboardToPattern(bitboard, size));
    }

    return transformations;
}

// Parse rules from the input file
function parseRules(input) {
    const rules = new Map();
    const lines = input.trim().split('\n');

    for (const line of lines) {
        const [pattern, result] = line.split(' => ');
        const transformations = getAllTransformations(pattern);

        for (const transformation of transformations) {
            rules.set(transformation, result);
        }
    }

    return rules;
}

// Split grid into subgrids of size 2x2 or 3x3
function splitGrid(grid) {
    const size = grid.length;
    const subgridSize = size % 2 === 0 ? 2 : 3;
    const subgridsPerRow = size / subgridSize;
    const subgrids = [];

    for (let i = 0; i < subgridsPerRow; i++) {
        for (let j = 0; j < subgridsPerRow; j++) {
            const subgrid = [];
            for (let x = 0; x < subgridSize; x++) {
                let row = '';
                for (let y = 0; y < subgridSize; y++) {
                    row += grid[i * subgridSize + x][j * subgridSize + y];
                }
                subgrid.push(row);
            }
            subgrids.push(subgrid.join('/'));
        }
    }

    return subgrids;
}

// Merge subgrids back into a single grid
function mergeSubgrids(subgrids, subgridSize) {
    const subgridsPerRow = Math.sqrt(subgrids.length);
    const size = subgridsPerRow * subgridSize;
    const grid = Array(size).fill('').map(() => '');

    for (let i = 0; i < subgridsPerRow; i++) {
        for (let j = 0; j < subgridsPerRow; j++) {
            const subgrid = subgrids[i * subgridsPerRow + j].split('/');

            for (let x = 0; x < subgridSize; x++) {
                for (let y = 0; y < subgridSize; y++) {
                    grid[i * subgridSize + x] += subgrid[x][y];
                }
            }
        }
    }

    return grid;
}

// Apply one iteration of enhancement
function enhanceGrid(grid, rules) {
    const subgrids = splitGrid(grid);
    const enhancedSubgrids = [];

    for (const subgrid of subgrids) {
        const enhancedSubgrid = rules.get(subgrid);
        if (!enhancedSubgrid) {
            throw new Error(`No rule found for subgrid: ${subgrid}`);
        }
        enhancedSubgrids.push(enhancedSubgrid);
    }

    const newSubgridSize = grid.length % 2 === 0 ? 3 : 4;
    return mergeSubgrids(enhancedSubgrids, newSubgridSize);
}

// Count the number of '#' in the grid
function countOnPixels(grid) {
    return grid.join('').split('').filter(c => c === '#').length;
}

// Process the grid for a given number of iterations
function solve(input, iterations) {
    const rules = parseRules(input);
    let grid = ['.#.', '..#', '###'];

    for (let i = 0; i < iterations; i++) {
        grid = enhanceGrid(grid, rules);
    }

    return countOnPixels(grid);
}

// Main execution
function main() {
    try {
        const input = fs.readFileSync('inputDay21.txt', 'utf8');

        console.time('Part 1');
        const part1 = solve(input, 5);
        console.timeEnd('Part 1');
        console.log(`After 5 iterations: ${part1} pixels are on`);

        console.time('Part 2');
        const part2 = solve(input, 18);
        console.timeEnd('Part 2');
        console.log(`After 18 iterations: ${part2} pixels are on`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
