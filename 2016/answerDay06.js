const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function getErrorCorrectedMessage(messages) {
    const messageLength = messages[0].length;
    const frequency = Array.from({ length: messageLength }, () => ({}));

    messages.forEach(message => {
        for (let i = 0; i < messageLength; i++) {
            const char = message[i];
            if (!frequency[i][char]) {
                frequency[i][char] = 0;
            }
            frequency[i][char]++;
        }
    });

    return frequency.map(freq => {
        return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    }).join('');
}

const messages = parseData('inputDay06.txt');
const errorCorrectedMessage = getErrorCorrectedMessage(messages);
console.log(`Error-corrected message: ${errorCorrectedMessage}`);


function getOriginalMessage(messages) {
    const messageLength = messages[0].length;
    const frequency = Array.from({ length: messageLength }, () => ({}));

    messages.forEach(message => {
        for (let i = 0; i < messageLength; i++) {
            const char = message[i];
            if (!frequency[i][char]) {
                frequency[i][char] = 0;
            }
            frequency[i][char]++;
        }
    });

    return frequency.map(freq => {
        return Object.keys(freq).reduce((a, b) => freq[a] < freq[b] ? a : b);
    }).join('');
}

const originalMessage = getOriginalMessage(messages);
console.log(`Original message: ${originalMessage}`);
