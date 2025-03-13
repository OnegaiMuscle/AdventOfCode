const fs = require('fs');

// Function to parse the input from a .txt file and split it into rows of numbers
function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim().split('\n').map(row => row.split(/\s+/).map(Number));
}

// Function to calculate the spreadsheet checksum
function calculateChecksum(spreadsheet) {
    return spreadsheet.reduce((checksum, row) => {
        const max = Math.max(...row);
        const min = Math.min(...row);
        return checksum + (max - min);
    }, 0); // Initial checksum is 0
}

// Example usage
const inputFilePath = 'inputDay02.txt'; // Replace with the path to your .txt file
const spreadsheet = parseInput(inputFilePath);
const checksum = calculateChecksum(spreadsheet);

console.log('Spreadsheet checksum:', checksum);
