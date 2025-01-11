const fs = require('fs');

function encodeString(str) {
    return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function calculateEncodedDifference(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    let originalCodeChars = 0;
    let encodedChars = 0;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
            originalCodeChars += trimmedLine.length;
            encodedChars += encodeString(trimmedLine).length;
        }
    });

    return encodedChars - originalCodeChars;
}

const filePath = 'inputDay08.txt';
const difference = calculateEncodedDifference(filePath);
console.log(`The difference is: ${difference}`);
