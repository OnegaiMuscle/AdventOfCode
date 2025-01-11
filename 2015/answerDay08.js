const fs = require('fs');

function calculateDifference(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    let codeChars = 0;
    let memoryChars = 0;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
            codeChars += trimmedLine.length;
            memoryChars += eval(trimmedLine).length;
        }
    });

    return codeChars - memoryChars;
}

// Example usage
const filePath = 'inputDay08.txt';
const difference = calculateDifference(filePath);
console.log(`The difference is: ${difference}`);
