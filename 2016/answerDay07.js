const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function hasABBA(sequence) {
    for (let i = 0; i < sequence.length - 3; i++) {
        if (sequence[i] !== sequence[i + 1] && sequence[i] === sequence[i + 3] && sequence[i + 1] === sequence[i + 2]) {
            return true;
        }
    }
    return false;
}

function supportsTLS(ip) {
    const parts = ip.split(/[\[\]]/);
    let hasABBAOutside = false;

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            if (hasABBA(parts[i])) {
                hasABBAOutside = true;
            }
        } else {
            if (hasABBA(parts[i])) {
                return false;
            }
        }
    }

    return hasABBAOutside;
}

function countIPsSupportingTLS(ips) {
    return ips.filter(supportsTLS).length;
}

// Exemple d'utilisation
const ips = parseData('inputDay07.txt');
const count = countIPsSupportingTLS(ips);
console.log(`Number of IPs supporting TLS: ${count}`);
