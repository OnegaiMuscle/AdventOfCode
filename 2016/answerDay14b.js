const crypto = require('crypto');

function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

function stretchedHash(input, iterations = 2017) {
    let hash = input;
    for (let i = 0; i < iterations; i++) {
        hash = md5(hash);
    }
    return hash;
}

function findTriplet(hash) {
    const match = hash.match(/(.)\1\1/);
    return match ? match[1] : null;
}

function containsQuintuplet(hash, char) {
    return new RegExp(`${char}{5}`).test(hash);
}

function generateKeys(salt, numKeys) {
    const keys = [];
    const potentialKeys = [];
    const hashCache = {};
    let index = 0;

    while (keys.length < numKeys) {
        if (!(index in hashCache)) {
            hashCache[index] = stretchedHash(`${salt}${index}`);
        }
        const hash = hashCache[index];
        const triplet = findTriplet(hash);

        if (triplet) {
            for (let i = index + 1; i <= index + 1000; i++) {
                if (!(i in hashCache)) {
                    hashCache[i] = stretchedHash(`${salt}${i}`);
                }
                const futureHash = hashCache[i];
                if (containsQuintuplet(futureHash, triplet)) {
                    keys.push(index);
                    break;
                }
            }
        }

        index++;
    }

    return keys;
}

const salt = 'zpqevtbw';
const numKeys = 64;
const keys = generateKeys(salt, numKeys);
console.log(`The index that produces the 64th one-time pad key is ${keys[63]}.`);
