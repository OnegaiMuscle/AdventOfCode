const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.replace(/\s+/g, ''); // Remove whitespace
}

function decompressLength(data) {
    let length = 0;
    let i = 0;

    while (i < data.length) {
        if (data[i] === '(') {
            const markerEnd = data.indexOf(')', i);
            const marker = data.slice(i + 1, markerEnd).split('x').map(Number);
            const [chars, repeat] = marker;
            length += chars * repeat;
            i = markerEnd + 1 + chars;
        } else {
            length++;
            i++;
        }
    }

    return length;
}

// Exemple d'utilisation
const data = parseData('inputDay09.txt');
const decompressedLength = decompressLength(data);
console.log(`Decompressed length: ${decompressedLength}`);
