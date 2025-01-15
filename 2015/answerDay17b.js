const fs = require('fs');

function parseContainerData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const containers = lines.map(line => parseInt(line));
    return containers;
}

function countCombinations(containers, target, start = 0, usedContainers = 0) {
    if (target === 0) return { count: 1, usedContainers };
    if (target < 0 || start >= containers.length) return { count: 0, usedContainers: Infinity };

    // Include the current container
    const include = countCombinations(containers, target - containers[start], start + 1, usedContainers + 1);

    // Exclude the current container
    const exclude = countCombinations(containers, target, start + 1, usedContainers);

    if (include.usedContainers < exclude.usedContainers) {
        return include;
    } else if (include.usedContainers > exclude.usedContainers) {
        return exclude;
    } else {
        return { count: include.count + exclude.count, usedContainers: include.usedContainers };
    }
}

function findMinContainers(containers, target) {
    const result = countCombinations(containers, target);
    return { minContainers: result.usedContainers, ways: result.count };
}

// Example usage:
const filePath = 'inputDay17.txt'; 
const containers = parseContainerData(filePath);
const target = 150;
const { minContainers, ways } = findMinContainers(containers, target);
console.log('Minimum number of containers:', minContainers);
console.log('Number of ways:', ways);
