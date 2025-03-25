const fs = require('fs');

// Parse box IDs from a .txt file
function parseBoxIDs(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data
        .split('\n') // Split by line
        .filter(line => line.trim() !== ''); // Remove empty lines
}

// Count the occurrences of each character in a string
function countOccurrences(id) {
    const counts = {};
    for (const char of id) {
        counts[char] = (counts[char] || 0) + 1;
    }
    return counts;
}

// Calculate the checksum
function calculateChecksum(boxIDs) {
    let twos = 0; // Count of IDs with exactly two of any letter
    let threes = 0; // Count of IDs with exactly three of any letter

    for (const id of boxIDs) {
        const counts = countOccurrences(id);

        // Check if there are any letters with exactly two or three occurrences
        if (Object.values(counts).includes(2)) {
            twos++;
        }
        if (Object.values(counts).includes(3)) {
            threes++;
        }
    }

    return twos * threes; // Multiply the two counts to get the checksum
}

// Find strings that differ by exactly one character
function findPrototypeBoxes(boxIDs) {
    for (let i = 0; i < boxIDs.length; i++) {
        for (let j = i + 1; j < boxIDs.length; j++) {
            const diff = findDifferences(boxIDs[i], boxIDs[j]);
            if (diff.count === 1) {
                return { box1: boxIDs[i], box2: boxIDs[j], common: diff.common };
            }
        }
    }
    return null;
}

// Helper function to find differences between two strings
function findDifferences(str1, str2) {
    let count = 0;
    let common = '';
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            count++;
        } else {
            common += str1[i];
        }
    }
    return { count, common };
}

// Main function
function main() {
    const filePath = 'inputDay02.txt'; // Replace with your file path
    const boxIDs = parseBoxIDs(filePath);

    if (boxIDs.length === 0) {
        console.error("No valid box IDs found.");
        return;
    }

    // Part 1: Calculate the checksum
    const checksum = calculateChecksum(boxIDs);
    console.log("Checksum:", checksum);

    // Part 2: Find the prototype boxes and their common letters
    const prototypeBoxes = findPrototypeBoxes(boxIDs);
    if (prototypeBoxes) {
        console.log("Prototype Boxes Found:");
        console.log("Box 1:", prototypeBoxes.box1);
        console.log("Box 2:", prototypeBoxes.box2);
        console.log("Common Letters:", prototypeBoxes.common);
    } else {
        console.log("No prototype boxes found that differ by exactly one character.");
    }
}

// Run the program
main();
