const crypto = require('crypto');

function findAdventCoin(secretKey) {
    let number = 1;
    while (true) {
        const hashInput = secretKey + number;
        const hashResult = crypto.createHash('md5').update(hashInput).digest('hex');
        if (hashResult.startsWith('000000')) {
            return number;
        }
        number++;
    }
}

const secretKey = 'iwrupvqb';
const result = findAdventCoin(secretKey);
console.log(`The lowest positive number that produces an MD5 hash starting with five zeroes is: ${result}`);
