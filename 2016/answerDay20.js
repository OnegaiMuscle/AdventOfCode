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
}

main();
