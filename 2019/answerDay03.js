const fs = require('fs');



// Wire Path Functions
function getWirePaths(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.trim().split('\n').map(line => line.split(','));
}

function traceWirePath(instructions) {
    const path = new Map();
    let x = 0, y = 0, steps = 0;

    for (const instruction of instructions) {
        const direction = instruction[0];
        const distance = parseInt(instruction.slice(1));

        for (let i = 0; i < distance; i++) {
            if (direction === 'R') x++;
            if (direction === 'L') x--;
            if (direction === 'U') y++;
            if (direction === 'D') y--;

            steps++;
            const key = `${x},${y}`;
            if (!path.has(key)) {
                path.set(key, steps);
            }
        }
    }

    return path;
}

function findClosestIntersection(filename) {
    const [wire1, wire2] = getWirePaths(filename);

    const path1 = traceWirePath(wire1);
    const path2 = traceWirePath(wire2);

    const intersections = [...path1.keys()].filter(point => path2.has(point));

    const distances = intersections.map(point => {
        const [x, y] = point.split(',').map(Number);
        return Math.abs(x) + Math.abs(y);
    });

    return Math.min(...distances);
}

function findFewestStepsIntersection(filename) {
    const [wire1, wire2] = getWirePaths(filename);

    const path1 = traceWirePath(wire1);
    const path2 = traceWirePath(wire2);

    const intersections = [...path1.keys()].filter(point => path2.has(point));

    const fewestSteps = intersections.map(point => path1.get(point) + path2.get(point));

    return Math.min(...fewestSteps);
}



const closestIntersectionDistance = findClosestIntersection('inputDay03.txt');
console.log('Closest intersection distance:', closestIntersectionDistance);

const fewestStepsIntersection = findFewestStepsIntersection('inputDay03.txt');
console.log('Fewest combined steps to intersection:', fewestStepsIntersection);
