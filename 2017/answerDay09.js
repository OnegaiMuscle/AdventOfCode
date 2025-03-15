
const fs = require('fs');

// Function to parse the input from a text file
function parseInput(filePath) {
    return fs.readFileSync(filePath, 'utf8').trim();
}

// Function to calculate the total score for all groups
function calculateGroupScore(input) {
    let totalScore = 0;
    let currentScore = 0;
    let inGarbage = false;
    let skipNext = false;

    for (const char of input) {
        if (skipNext) {
            // Skip the next character due to "!"
            skipNext = false;
            continue;
        }

        if (char === '!') {
            // Ignore the next character
            skipNext = true;
        } else if (inGarbage) {
            if (char === '>') {
                // End of garbage
                inGarbage = false;
            }
        } else {
            if (char === '<') {
                // Start of garbage
                inGarbage = true;
            } else if (char === '{') {
                // Start of a new group
                currentScore++;
                totalScore += currentScore;
            } else if (char === '}') {
                // End of the current group
                currentScore--;
            }
        }
    }

    return totalScore;
}

// Main function
function main() {
    const filePath = 'inputDay09.txt'; // Replace with your input file path
    const input = parseInput(filePath);
    const totalScore = calculateGroupScore(input);
    console.log(`The total score for all groups is: ${totalScore}`);
}

main();
