const fs = require('fs');

function importAndFormatData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const distances = {};

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
            const [locations, distance] = trimmedLine.split(' = ');
            const [location1, location2] = locations.split(' to ');

            if (!distances[location1]) {
                distances[location1] = {};
            }
            if (!distances[location2]) {
                distances[location2] = {};
            }

            distances[location1][location2] = parseInt(distance, 10);
            distances[location2][location1] = parseInt(distance, 10);
        }
    });

    return distances;
}


function getPermutations(array) {
    if (array.length === 1) return [array];
    const permutations = [];
    for (let i = 0; i < array.length; i++) {
        const current = array[i];
        const remaining = array.slice(0, i).concat(array.slice(i + 1));
        const remainingPermutations = getPermutations(remaining);
        for (let perm of remainingPermutations) {
            permutations.push([current].concat(perm));
        }
    }
    return permutations;
}

function calculateRouteDistance(route, distances) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        totalDistance += distances[route[i]][route[i + 1]];
    }
    return totalDistance;
}


function findLongestRoute(distances) {
    const locations = Object.keys(distances);
    const permutations = getPermutations(locations);
    let longestDistance = -Infinity;
    let longestRoute = null;

    for (let route of permutations) {
        const distance = calculateRouteDistance(route, distances);
        if (distance > longestDistance) {
            longestDistance = distance;
            longestRoute = route;
        }
    }

    return { longestRoute, longestDistance };
}


const filePath = 'inputDay09.txt';
const distances = importAndFormatData(filePath);
const result = findLongestRoute(distances);
console.log(`The longest route is: ${result.longestRoute.join(' -> ')} with a distance of ${result.longestDistance}`);
