const fs = require('fs');

// Function to parse orbit map data from a txt file
function parseOrbitData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n').map(line => line.split(')'));
}

// Function to build an orbit map from the data
function buildOrbitMap(orbits) {
    const orbitMap = new Map();
    for (const [center, orbiter] of orbits) {
        orbitMap.set(orbiter, center);
    }
    return orbitMap;
}

// Function to count total orbits
function countOrbits(orbitMap) {
    let totalOrbits = 0;

    for (const obj of orbitMap.keys()) {
        let current = obj;
        while (orbitMap.has(current)) {
            current = orbitMap.get(current);
            totalOrbits++;
        }
    }

    return totalOrbits;
}

// Function to find the path from an object to COM
function getOrbitPath(orbitMap, obj) {
    const path = new Map();
    let steps = 0;
    while (orbitMap.has(obj)) {
        obj = orbitMap.get(obj);
        path.set(obj, steps++);
    }
    return path;
}

// Function to calculate minimum orbital transfers
function calculateOrbitalTransfers(orbitMap, start, end) {
    const startPath = getOrbitPath(orbitMap, start);
    const endPath = getOrbitPath(orbitMap, end);

    for (const [obj, steps] of startPath.entries()) {
        if (endPath.has(obj)) {
            return steps + endPath.get(obj);
        }
    }
    return -1; // Should never occur if input is valid
}

// Main execution
function main() {
    const filePath = 'inputDay06.txt'; // Change to your actual file path
    const orbitData = parseOrbitData(filePath);
    const orbitMap = buildOrbitMap(orbitData);

    const totalOrbits = countOrbits(orbitMap);
    console.log(`Total number of direct and indirect orbits: ${totalOrbits}`);

    const transfers = calculateOrbitalTransfers(orbitMap, 'YOU', 'SAN');
    console.log(`Minimum orbital transfers required: ${transfers}`);
}

main();
