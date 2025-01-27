const crypto = require('crypto');

function findPassword(doorID) {
    let password = '';
    let index = 0;

    while (password.length < 8) {
        const hash = crypto.createHash('md5').update(doorID + index).digest('hex');
        if (hash.startsWith('00000')) {
            password += hash[5];
        }
        index++;
    }

    return password;
}

const doorID = 'ffykfhsq';
const password = findPassword(doorID);
console.log(`Password: ${password}`);


function findPasswordbis(doorID) {
    let password = Array(8).fill(null);
    let index = 0;
    let found = 0;

    while (found < 8) {
        const hash = crypto.createHash('md5').update(doorID + index).digest('hex');
        if (hash.startsWith('00000')) {
            const position = parseInt(hash[5], 10);
            if (position >= 0 && position < 8 && password[position] === null) {
                password[position] = hash[6];
                found++;
            }
        }
        index++;
    }

    return password.join('');
}


const passwordbis = findPasswordbis(doorID);
console.log(`Password: ${passwordbis}`);
