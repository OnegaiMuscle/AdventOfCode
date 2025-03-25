const fs = require('fs');

// Parse frequency changes from a file
function parseFrequencyChanges(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.split('\n').filter(line => line.trim() !== '').map(Number);
}

// Calculate the resulting frequency after all changes
function calculateFrequency(changes) {
    return changes.reduce((frequency, change) => frequency + change, 0);
}

// Find the first frequency reached twice
function findFirstRepeatedFrequency(changes) {
    const seenFrequencies = new Set();
    let currentFrequency = 0;
    let index = 0;

    while (true) {
        // Get the change at the current index (looping through the array)
        const change = changes[index % changes.length];
        currentFrequency += change;

        // Check if this frequency has already been seen
        if (seenFrequencies.has(currentFrequency)) {
            return currentFrequency; // First repeated frequency found
        }

        // Add the current frequency to the set
        seenFrequencies.add(currentFrequency);

        // Move to the next change
        index++;
    }
}

// Example usage:
// Replace 'frequency_changes.txt' with the path to your input file
const filePath = 'inputDay01.txt';
const changes = parseFrequencyChanges(filePath);

// Part 1: Calculate resulting frequency
const resultingFrequency = calculateFrequency(changes);
console.log("Resulting Frequency:", resultingFrequency);

// Part 2: Find the first frequency reached twice
const firstRepeatedFrequency = findFirstRepeatedFrequency(changes);
console.log("First Repeated Frequency:", firstRepeatedFrequency);
