const fs = require('fs');

// Function to parse the map from a text file
function parseMap(filename) {
    const data = fs.readFileSync(filename, 'utf-8').trim();
    const grid = data.split('\n').map(row => row.split(''));
    return grid;
}

// Directions: Up, Right, Down, Left
const DIRECTIONS = [
    [-1, 0], // Up
    [0, 1],  // Right
    [1, 0],  // Down
    [0, -1]  // Left
];

// Part 1: Basic Virus Simulation (10,000 bursts)
function simulateVirusBasic(grid, bursts) {
    const infected = new Set();

    // Initialize the infected set from the grid
    const rows = grid.length;
    const cols = grid[0].length;
    const offset = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '#') {
                infected.add(`${r - offset},${c - offset}`);
            }
        }
    }

    let x = 0, y = 0, direction = 0, infections = 0;

    for (let burst = 0; burst < bursts; burst++) {
        const key = `${x},${y}`;

        if (infected.has(key)) {
            // Turn right, clean the node
            direction = (direction + 1) % 4;
            infected.delete(key);
        } else {
            // Turn left, infect the node
            direction = (direction + 3) % 4;
            infected.add(key);
            infections++;
        }

        // Move forward
        x += DIRECTIONS[direction][0];
        y += DIRECTIONS[direction][1];
    }

    return infections;
}

// Part 2: Advanced Virus Simulation with New States (10,000,000 bursts)
function simulateVirusAdvanced(grid, bursts) {
    const nodeStates = new Map();

    // Initialize the node states from the grid
    const rows = grid.length;
    const cols = grid[0].length;
    const offset = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '#') {
                nodeStates.set(`${r - offset},${c - offset}`, 'infected');
            }
        }
    }

    let x = 0, y = 0, direction = 0, infections = 0;

    for (let burst = 0; burst < bursts; burst++) {
        const key = `${x},${y}`;
        const state = nodeStates.get(key) || 'clean';

        if (state === 'clean') {
            // Turn left, weaken the node
            direction = (direction + 3) % 4;
            nodeStates.set(key, 'weakened');
        } else if (state === 'weakened') {
            // Continue forward, infect the node
            nodeStates.set(key, 'infected');
            infections++;
        } else if (state === 'infected') {
            // Turn right, flag the node
            direction = (direction + 1) % 4;
            nodeStates.set(key, 'flagged');
        } else if (state === 'flagged') {
            // Reverse direction, clean the node
            direction = (direction + 2) % 4;
            nodeStates.delete(key);
        }

        // Move forward
        x += DIRECTIONS[direction][0];
        y += DIRECTIONS[direction][1];
    }

    return infections;
}

// Main function
function main() {
    const filename = 'inputDay22.txt'; // Replace with your input filename
    const grid = parseMap(filename);

    // Part 1
    const burstsPart1 = 10000;
    const resultPart1 = simulateVirusBasic(grid, burstsPart1);
    console.log(`After ${burstsPart1} bursts (Part 1), ${resultPart1} bursts caused an infection.`);

    // Part 2
    const burstsPart2 = 10000000;
    const resultPart2 = simulateVirusAdvanced(grid, burstsPart2);
    console.log(`After ${burstsPart2} bursts (Part 2), ${resultPart2} bursts caused an infection.`);
}

// Run the main function
main();
