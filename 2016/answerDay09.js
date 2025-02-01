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

const data = parseData('inputDay09.txt');
const decompressedLength = decompressLength(data);
console.log(`Decompressed length: ${decompressedLength}`);


function decompressLengthV2(data) {
    function calculateLength(data, start, end) {
        let length = 0;
        let i = start;

        while (i < end) {
            if (data[i] === '(') {
                const markerEnd = data.indexOf(')', i);
                const marker = data.slice(i + 1, markerEnd).split('x').map(Number);
                const [chars, repeat] = marker;
                length += repeat * calculateLength(data, markerEnd + 1, markerEnd + 1 + chars);
                i = markerEnd + 1 + chars;
            } else {
                length++;
                i++;
            }
        }

        return length;
    }

    return calculateLength(data, 0, data.length);
}

const decompressedLengthV2 = decompressLengthV2(data);
console.log(`Decompressed length (version 2): ${decompressedLengthV2}`);
