const fs = require('fs');

function getWirePaths(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.trim().split('\n').map(line => line.split(','));
}

function traceWirePath(instructions) {
    const path = new Set();
    let x = 0, y = 0;

    for (const instruction of instructions) {
        const direction = instruction[0];
        const steps = parseInt(instruction.slice(1));

        for (let i = 0; i < steps; i++) {
            if (direction === 'R') x++;
            if (direction === 'L') x--;
            if (direction === 'U') y++;
            if (direction === 'D') y--;

            path.add(`${x},${y}`);
        }
    }

    return path;
}

function findClosestIntersection(filename) {
    const [wire1, wire2] = getWirePaths(filename);

    const path1 = traceWirePath(wire1);
    const path2 = traceWirePath(wire2);

    const intersections = [...path1].filter(point => path2.has(point));

    const distances = intersections.map(point => {
        const [x, y] = point.split(',').map(Number);
        return Math.abs(x) + Math.abs(y);
    });

    return Math.min(...distances);
}

// Example usage
const closestDistance = findClosestIntersection('inputDay03.txt');
console.log('Closest intersection distance:', closestDistance);
