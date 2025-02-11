const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'inputDay20.txt');

// Function to parse data from a text file
function parseDataFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim();
    return data.split('\n').map(line => {
        const [start, end] = line.split('-').map(Number);
        return { start, end };
    });
}

// Function to find the lowest unblocked IP
function findLowestUnblockedIP(ranges) {
    // Sort ranges by their start value
    ranges.sort((a, b) => a.start - b.start);

    let lowestUnblockedIP = 0;

    for (const range of ranges) {
        if (lowestUnblockedIP < range.start) {
            // We have found an unblocked IP
            break;
        }
        // Move to the next possible unblocked IP after the current range
        lowestUnblockedIP = Math.max(lowestUnblockedIP, range.end + 1);
    }

    return lowestUnblockedIP;
}

// Main function to run the solution
function main() {
    const ranges = parseDataFromFile(filePath);
    const lowestUnblockedIP = findLowestUnblockedIP(ranges);
    console.log(`The lowest-valued IP that is not blocked is: ${lowestUnblockedIP}`);
    const allowedIPs = countAllowedIPs(ranges);
    console.log(`The number of IPs that are allowed by the blacklist is: ${allowedIPs}`);
  }

main();


// Function to find the total number of allowed IPs
function countAllowedIPs(ranges) {
    // Sort ranges by their start value
    ranges.sort((a, b) => a.start - b.start);

    let allowedIPs = 0;
    let currentIP = 0;

    for (const range of ranges) {
        if (currentIP < range.start) {
            allowedIPs += range.start - currentIP;
        }
        currentIP = Math.max(currentIP, range.end + 1);
    }

    if (currentIP <= 4294967295) {
        allowedIPs += 4294967295 - currentIP + 1;
    }

    return allowedIPs;
}


