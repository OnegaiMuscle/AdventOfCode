const fs = require('fs');

// Function to parse asteroid map from a text file
function parseAsteroidMap(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    return data.split('\n').map(row => row.split(''));
}

// Function to get all asteroid positions
function getAsteroidPositions(map) {
    const asteroids = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') {
                asteroids.push([x, y]);
            }
        }
    }
    return asteroids;
}

// Function to calculate visible asteroids from a given position
function countVisibleAsteroids(position, asteroids) {
    const angles = new Set();
    const [x1, y1] = position;

    for (const [x2, y2] of asteroids) {
        if (x1 === x2 && y1 === y2) continue; // Skip self

        const angle = Math.atan2(y2 - y1, x2 - x1);
        angles.add(angle);
    }

    return angles.size;
}

// Function to find the best asteroid location for the monitoring station
function findBestAsteroidLocation(asteroids) {
    let bestLocation = null;
    let maxVisible = 0;

    for (const asteroid of asteroids) {
        const visibleCount = countVisibleAsteroids(asteroid, asteroids);
        if (visibleCount > maxVisible) {
            maxVisible = visibleCount;
            bestLocation = asteroid;
        }
    }

    return { location: bestLocation, detectedCount: maxVisible };
}

// Function to simulate laser vaporization sequence with proper clockwise rotation
function vaporizeAsteroids(station, asteroids) {
    const asteroidMap = new Map();
    const [sx, sy] = station;

    for (const [ax, ay] of asteroids) {
        if (ax === sx && ay === sy) continue; // Skip the station itself

        const angle = Math.atan2(ax - sx, sy - ay); // Clockwise rotation adjustment
        const distance = Math.hypot(ax - sx, ay - sy);

        if (!asteroidMap.has(angle)) {
            asteroidMap.set(angle, []);
        }

        asteroidMap.get(angle).push({ x: ax, y: ay, distance });
    }

    // Sort each angle group by distance (closest first)
    for (const angle of asteroidMap.keys()) {
        asteroidMap.get(angle).sort((a, b) => a.distance - b.distance);
    }

    // Sort angles in **correct clockwise order** (starting UP)
    const sortedAngles = [...asteroidMap.keys()].sort((a, b) => a - b);

    let vaporized = [];
    while (vaporized.length < asteroids.length - 1) {
        for (const angle of sortedAngles) {
            if (asteroidMap.get(angle).length > 0) {
                vaporized.push(asteroidMap.get(angle).shift()); // Vaporize closest asteroid at this angle
            }
        }
    }

    return vaporized;
}

// Main execution
function main() {
    const filePath = 'inputDay10.txt'; // Change to actual file path
    const asteroidMap = parseAsteroidMap(filePath);
    const asteroids = getAsteroidPositions(asteroidMap);

    // Step 1: Find the best monitoring station location
    const bestLocation = findBestAsteroidLocation(asteroids);
    console.log(`Best location: (${bestLocation.location[0]}, ${bestLocation.location[1]})`);
    console.log(`Number of detectable asteroids: ${bestLocation.detectedCount}`);

    // Step 2: Vaporize asteroids in correct rotational order
    const vaporizedAsteroids = vaporizeAsteroids(bestLocation.location, asteroids);

    // Step 3: Find the **200th vaporized asteroid**
    const asteroid200 = vaporizedAsteroids[199];
    const finalScore = asteroid200.x * 100 + asteroid200.y;

    console.log(`200th vaporized asteroid: (${asteroid200.x}, ${asteroid200.y})`);
    console.log(`Final answer: ${finalScore}`);
}

main();
