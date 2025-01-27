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
