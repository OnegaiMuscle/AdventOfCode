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


// Function to calculate the new captcha solution
function calculateCaptchabis(input) {
    const length = input.length;
    const step = length / 2; // Step size is half the list length
    return input.split('').reduce((sum, currentDigit, index, arr) => {
        const matchDigit = arr[(index + step) % length]; // Circular comparison
        return currentDigit === matchDigit ? sum + parseInt(currentDigit, 10) : sum;
    }, 0); // Initial sum is 0
}

const resultbis = calculateCaptchabis(input);

console.log('Captcha solution:', resultbis);
