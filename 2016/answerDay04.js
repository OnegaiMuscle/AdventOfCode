const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function getChecksum(name) {
    const counts = {};
    for (const char of name.replace(/-/g, '')) {
        counts[char] = (counts[char] || 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 5)
        .map(entry => entry[0])
        .join('');
}

function isRealRoom(name, checksum) {
    return getChecksum(name) === checksum;
}

function sumOfSectorIDs(rooms) {
    return rooms.reduce((sum, room) => {
        const match = room.match(/^([a-z-]+)-(\d+)\[([a-z]+)\]$/);
        if (match) {
            const [, name, sectorID, checksum] = match;
            if (isRealRoom(name, checksum)) {
                return sum + parseInt(sectorID, 10);
            }
        }
        return sum;
    }, 0);
}

// Exemple d'utilisation
const rooms = parseData('inputDay04.txt');
const totalSectorIDSum = sumOfSectorIDs(rooms);
console.log(`Sum of sector IDs of real rooms: ${totalSectorIDSum}`);
