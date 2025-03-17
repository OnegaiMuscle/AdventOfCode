const fs = require('fs');

// Function to parse data from a text file
function parseData(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.trim().split('\n');
    const firewall = {};
    lines.forEach(line => {
        const [depth, range] = line.split(': ').map(Number);
        firewall[depth] = range;
    });
    return firewall;
}

// Function to calculate the severity of the trip
function calculateSeverity(firewall) {
    let severity = 0;
    for (const depth in firewall) {
        const range = firewall[depth];
        // If caught at this layer
        if (depth % ((range - 1) * 2) === 0) {
            severity += depth * range;
        }
    }
    return severity;
}

// Example usage
const firewall = parseData('inputDay13.txt'); // Replace 'input.txt' with your file name
const severity = calculateSeverity(firewall);
console.log(`The severity of your whole trip is: ${severity}`);



// Function to check if caught for a given delay
function isCaught(firewall, delay) {
    for (const depth in firewall) {
        const range = firewall[depth];
        // Check if the scanner is at the top at the moment the packet reaches this layer
        if ((parseInt(depth) + delay) % ((range - 1) * 2) === 0) {
            return true; // Packet is caught
        }
    }
    return false; // Packet passes without being caught
}

// Function to find the minimum delay to pass through safely
function findMinimumDelay(firewall) {
    let delay = 0;
    while (true) {
        if (!isCaught(firewall, delay)) {
            return delay; // Found the minimum delay
        }
        delay++;
    }
}


const minimumDelay = findMinimumDelay(firewall);
console.log(`The fewest number of picoseconds to delay is: ${minimumDelay}`);
