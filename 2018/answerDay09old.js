const fs = require("fs");

// Function to parse data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim();
    const match = data.match(/(\d+) players; last marble is worth (\d+) points/);
    if (match) {
        return { players: parseInt(match[1]), lastMarble: parseInt(match[2]) };
    }
    throw new Error("Invalid file format");
}

// Function to calculate the highest score
function getWinningScore(players, lastMarble) {
    const scores = new Array(players).fill(0);
    const circle = [0];
    let currentMarbleIndex = 0;
    let currentPlayer = 0;

    for (let marble = 1; marble <= lastMarble; marble++) {
        if (marble % 23 === 0) {
            // Special case for multiples of 23
            scores[currentPlayer] += marble;
            currentMarbleIndex = (currentMarbleIndex - 7 + circle.length) % circle.length;
            scores[currentPlayer] += circle.splice(currentMarbleIndex, 1)[0];
        } else {
            // Normal placement
            currentMarbleIndex = (currentMarbleIndex + 2) % circle.length;
            circle.splice(currentMarbleIndex, 0, marble);
        }
        currentPlayer = (currentPlayer + 1) % players;
    }

    return Math.max(...scores);
}

// Function to calculate for normal and scaled scenarios
function calculateScores(filePath) {
    const { players, lastMarble } = parseData(filePath);

    // Case 1: Regular last marble value
    const regularWinningScore = getWinningScore(players, lastMarble);
    console.log(`Winning Elf's Score (Regular): ${regularWinningScore}`);

    // Case 2: Last marble value scaled 100 times
    const scaledWinningScore = getWinningScore(players, lastMarble * 100);
    console.log(`Winning Elf's Score (Scaled): ${scaledWinningScore}`);
}

// Example usage
const inputFile = "inputDay09.txt"; // Replace with your text file
calculateScores(inputFile);
