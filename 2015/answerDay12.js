const fs = require('fs');

// Function to recursively find and sum all numbers in a JSON object
function sumNumbers(obj) {
    let sum = 0;

    if (typeof obj === 'number') {
        return obj;
    } else if (Array.isArray(obj)) {
        for (let item of obj) {
            sum += sumNumbers(item);
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                sum += sumNumbers(obj[key]);
            }
        }
    }

    return sum;
}

// Function to read the JSON document and calculate the sum of all numbers
function calculateSum(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    return sumNumbers(json);
}

// Example usage
const filePath = 'inputDay12.txt'; 
const totalSum = calculateSum(filePath);
console.log(`The sum of all numbers in the document is: ${totalSum}`);
