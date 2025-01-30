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

const ips = parseData('inputDay07.txt');
const count = countIPsSupportingTLS(ips);
console.log(`Number of IPs supporting TLS: ${count}`);


function hasABA(sequence) {
    const abas = [];
    for (let i = 0; i < sequence.length - 2; i++) {
        if (sequence[i] === sequence[i + 2] && sequence[i] !== sequence[i + 1]) {
            abas.push(sequence.slice(i, i + 3));
        }
    }
    return abas;
}

function supportsSSL(ip) {
    const parts = ip.split(/[\[\]]/);
    const supernetSequences = [];
    const hypernetSequences = [];

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            supernetSequences.push(parts[i]);
        } else {
            hypernetSequences.push(parts[i]);
        }
    }

    const abas = supernetSequences.flatMap(hasABA);
    for (const aba of abas) {
        const bab = aba[1] + aba[0] + aba[1];
        if (hypernetSequences.some(seq => seq.includes(bab))) {
            return true;
        }
    }

    return false;
}

function countIPsSupportingSSL(ips) {
    return ips.filter(supportsSSL).length;
}

const countbis = countIPsSupportingSSL(ips);
console.log(`Number of IPs supporting SSL: ${countbis}`);
