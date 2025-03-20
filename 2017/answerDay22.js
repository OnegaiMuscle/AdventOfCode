
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

// Virus simulation
function simulateVirus(grid, bursts) {
    // Set for infected nodes
    const infected = new Set();

    // Initialize the grid
    const rows = grid.length;
    const cols = grid[0].length;
    const offset = Math.floor(rows / 2);

    // Populate the infected set from the initial grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '#') {
                infected.add(`${r - offset},${c - offset}`);
            }
        }
    }

    // Virus carrier position and direction
    let x = 0; // Row
    let y = 0; // Column
    let direction = 0; // Initially facing up
    let infections = 0; // Count of caused infections

    for (let burst = 0; burst < bursts; burst++) {
        const key = `${x},${y}`;

        // Check if current node is infected
        if (infected.has(key)) {
            // Infected: Turn right
            direction = (direction + 1) % 4;
            infected.delete(key); // Clean the node
        } else {
            // Clean: Turn left
            direction = (direction + 3) % 4; // Left turn
            infected.add(key); // Infect the node
            infections++;
        }

        // Move forward in the current direction
        x += DIRECTIONS[direction][0];
        y += DIRECTIONS[direction][1];
    }

    return infections; // Return the number of caused infections
}

// Main function
function main() {
    const filename = 'inputDay22.txt'; // Replace with your input filename
    const grid = parseMap(filename);
    const bursts = 10000; // Number of bursts to simulate

    const result = simulateVirus(grid, bursts);
    console.log(`After ${bursts} bursts, ${result} bursts caused an infection.`);
}

// Run the main function
main();
