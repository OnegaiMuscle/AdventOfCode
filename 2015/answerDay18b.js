const fs = require('fs');

const corners = new Set([
    [0, 0].toString(),
    [0, 99].toString(),
    [99, 0].toString(),
    [99, 99].toString()
]);

function parseLightsFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lights = new Set(corners);
    data.trim().split('\n').forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '#') {
                lights.add([x, y].toString());
            }
        });
    });
    return lights;
}

function countNeighbors(lights, x, y) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    return directions.reduce((count, [dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return count + lights.has([nx, ny].toString());
    }, 0);
}

function animateLights(lights, steps) {
    for (let step = 0; step < steps; step++) {
        const newLights = new Set(corners);
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                const neighbors = countNeighbors(lights, x, y);
                const key = [x, y].toString();
                if (lights.has(key) && (neighbors === 2 || neighbors === 3)) {
                    newLights.add(key);
                } else if (!lights.has(key) && neighbors === 3) {
                    newLights.add(key);
                }
            }
        }
        lights = newLights;
    }
    return lights;
}

// Example usage:
const filePath = 'inputDay18.txt'; // Replace with the path to your text file
let lights = parseLightsFromFile(filePath);
lights = animateLights(lights, 100);
console.log('Number of lights on after 100 steps:', lights.size);
