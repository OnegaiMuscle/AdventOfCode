const fs = require("fs");

// Parse coordinates from a text file
function parseCoordinatesFromFile(filePath) {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.split("\n").map(line => {
        if (!line.trim()) return null; // Skip empty lines
        const [x, y] = line.split(", ").map(Number);
        if (isNaN(x) || isNaN(y)) {
            console.error("Invalid line in input:", line);
            return null;
        }
        return { x, y };
    }).filter(coord => coord !== null); // Remove null entries
}

// Calculate Manhattan distance between two points
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Find the size of the largest finite area
function findLargestFiniteArea(coordinates) {
    const padding = 10; // Extend the grid boundary
    const minX = Math.min(...coordinates.map(coord => coord.x)) - padding;
    const maxX = Math.max(...coordinates.map(coord => coord.x)) + padding;
    const minY = Math.min(...coordinates.map(coord => coord.y)) - padding;
    const maxY = Math.max(...coordinates.map(coord => coord.y)) + padding;

    const areaCount = new Map();
    const infiniteAreas = new Set();

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            let closest = null;
            let minDistance = Infinity;
            let isTied = false;

            coordinates.forEach((coord, index) => {
                const distance = manhattanDistance(x, y, coord.x, coord.y);
                if (distance < minDistance) {
                    closest = index;
                    minDistance = distance;
                    isTied = false;
                } else if (distance === minDistance) {
                    isTied = true;
                }
            });

            if (isTied) continue;

            if (x === minX || x === maxX || y === minY || y === maxY) {
                infiniteAreas.add(closest);
            }

            areaCount.set(closest, (areaCount.get(closest) || 0) + 1);
        }
    }

    let largestArea = 0;
    areaCount.forEach((count, coordIndex) => {
        if (!infiniteAreas.has(coordIndex)) {
            largestArea = Math.max(largestArea, count);
        }
    });

    return largestArea;
}

// Find the size of the safe region (sum of distances < threshold)
function findSafeRegionSize(coordinates, distanceThreshold) {
    const padding = 10; // Extend the grid boundary
    const minX = Math.min(...coordinates.map(coord => coord.x)) - padding;
    const maxX = Math.max(...coordinates.map(coord => coord.x)) + padding;
    const minY = Math.min(...coordinates.map(coord => coord.y)) - padding;
    const maxY = Math.max(...coordinates.map(coord => coord.y)) + padding;

    let safeRegionSize = 0;

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const totalDistance = coordinates.reduce((sum, coord) => {
                return sum + manhattanDistance(x, y, coord.x, coord.y);
            }, 0);

            if (totalDistance < distanceThreshold) {
                safeRegionSize++;
            }
        }
    }

    return safeRegionSize;
}

// Main function to solve both problems
function solve(filePath, distanceThreshold) {
    const coordinates = parseCoordinatesFromFile(filePath);

    console.log("Coordinates parsed:", coordinates);

    // Find the size of the largest finite area
    const largestFiniteArea = findLargestFiniteArea(coordinates);
    console.log("Size of the largest finite area:", largestFiniteArea);

    // Find the size of the safe region
    const safeRegionSize = findSafeRegionSize(coordinates, distanceThreshold);
    console.log(`Size of the safe region (distance threshold < ${distanceThreshold}):`, safeRegionSize);
}

// Example usage: Replace 'coordinates.txt' with your input file
// Set the threshold for safe region calculation (e.g., 32 or 10000)
solve("inputDay06.txt", 10000);
