const crypto = require('crypto');

// Fonction pour obtenir l'état des portes à partir du hachage MD5
function getDoorStates(hash) {
    return {
        up: ['b', 'c', 'd', 'e', 'f'].includes(hash[0]),
        down: ['b', 'c', 'd', 'e', 'f'].includes(hash[1]),
        left: ['b', 'c', 'd', 'e', 'f'].includes(hash[2]),
        right: ['b', 'c', 'd', 'e', 'f'].includes(hash[3]),
    };
}

// Fonction pour générer le hachage MD5
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

// Fonction pour trouver le chemin le plus court vers la voûte
function findShortestPath(passcode) {
    const queue = [{ x: 0, y: 0, path: '' }];
    const directions = [
        { x: 0, y: -1, move: 'U' },
        { x: 0, y: 1, move: 'D' },
        { x: -1, y: 0, move: 'L' },
        { x: 1, y: 0, move: 'R' },
    ];

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();
        if (x === 3 && y === 3) {
            return path;
        }

        const hash = md5(passcode + path);
        const doorStates = getDoorStates(hash);

        directions.forEach((direction, index) => {
            const newX = x + direction.x;
            const newY = y + direction.y;

            if (
                newX >= 0 && newX < 4 &&
                newY >= 0 && newY < 4 &&
                doorStates[Object.keys(doorStates)[index]]
            ) {
                queue.push({ x: newX, y: newY, path: path + direction.move });
            }
        });
    }

    return null;
}

// Entrée du puzzle
const passcode = 'pgflpeqp';
const shortestPath = findShortestPath(passcode);
console.log(`Le chemin le plus court vers la voûte est : ${shortestPath}`);
