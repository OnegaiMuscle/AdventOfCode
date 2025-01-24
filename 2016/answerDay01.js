const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split(', ');
}

function calculateDistance(directions) {
    let x = 0, y = 0;
    let direction = 0; // 0: North, 1: East, 2: South, 3: West

    directions.forEach(instruction => {
        const turn = instruction[0];
        const steps = parseInt(instruction.slice(1), 10);

        if (turn === 'L') {
            direction = (direction + 3) % 4;
        } else if (turn === 'R') {
            direction = (direction + 1) % 4;
        }

        switch (direction) {
            case 0: y += steps; break;
            case 1: x += steps; break;
            case 2: y -= steps; break;
            case 3: x -= steps; break;
        }
    });

    return Math.abs(x) + Math.abs(y);
}


function calculateFirstRepeatedDistance(directions) {
    let x = 0, y = 0;
    let direction = 0; // 0: North, 1: East, 2: South, 3: West
    const visited = new Set();
    visited.add(`${x},${y}`);

    for (const instruction of directions) {
        const turn = instruction[0];
        const steps = parseInt(instruction.slice(1), 10);

        if (turn === 'L') {
            direction = (direction + 3) % 4;
        } else if (turn === 'R') {
            direction = (direction + 1) % 4;
        }

        for (let step = 0; step < steps; step++) {
            switch (direction) {
                case 0: y += 1; break;
                case 1: x += 1; break;
                case 2: y -= 1; break;
                case 3: x -= 1; break;
            }

            const position = `${x},${y}`;
            if (visited.has(position)) {
                return Math.abs(x) + Math.abs(y);
            }
            visited.add(position);
        }
    }

    return -1; // No repeated position found
}


const directions = parseData('inputDay01.txt');
const distance = calculateDistance(directions);
console.log(`Distance to Easter Bunny HQ: ${distance} blocks`);
const distancebis = calculateFirstRepeatedDistance(directions);
console.log(`Distance to the first location visited twice: ${distancebis} blocks`);
