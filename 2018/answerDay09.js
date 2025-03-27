
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
    const scores = new Array(players).fill(0); // Initialize scores for each player
    const circle = [0]; // Initialize the circle with the first marble
    let currentMarbleIndex = 0;
    let currentPlayer = 0;

    for (let marble = 1; marble <= lastMarble; marble++) {
        if (marble % 23 === 0) {
            // Special case for multiples of 23
            scores[currentPlayer] += marble;
            currentMarbleIndex = (currentMarbleIndex - 7 + circle.length) % circle.length; // Move counter-clockwise 7 marbles
            scores[currentPlayer] += circle.splice(currentMarbleIndex, 1)[0]; // Remove marble and add its value to score
        } else {
            // Normal placement
            currentMarbleIndex = (currentMarbleIndex + 2) % circle.length;
            circle.splice(currentMarbleIndex, 0, marble); // Insert marble
        }
        currentPlayer = (currentPlayer + 1) % players; // Next player's turn
    }

    return Math.max(...scores); // Return the highest score
}

// Example usage
const inputFile = "inputDay09.txt"; // Replace with your text file
const { players, lastMarble } = parseData(inputFile);
const winningScore = getWinningScore(players, lastMarble);

console.log(`Winning Elf's Score: ${winningScore}`);
