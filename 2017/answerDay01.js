const fs = require('fs');


function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim(); // Remove any extraneous whitespace or newlines
}

function calculateCaptcha(input) {
    return input.split('').reduce((sum, currentDigit, index, arr) => {
        const nextDigit = arr[(index + 1) % arr.length]; // Use modulo for circular comparison
        return currentDigit === nextDigit ? sum + parseInt(currentDigit, 10) : sum;
    }, 0); // Initial sum is 0
}

// Example usage
const inputFilePath = 'inputDay01.txt'; // Replace with the path to your .txt file
const input = parseInput(inputFilePath);
const result = calculateCaptcha(input);

console.log('Captcha solution:', result);
