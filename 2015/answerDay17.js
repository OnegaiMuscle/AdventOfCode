function countCombinations(containers, target, start = 0) {
  if (target === 0) return 1;
  if (target < 0 || start >= containers.length) return 0;

  // Include the current container
  const include = countCombinations(containers, target - containers[start], start + 1);

  // Exclude the current container
  const exclude = countCombinations(containers, target, start + 1);

  return include + exclude;
}

const fs = require('fs');

function parseContainerData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const containers = lines.map(line => parseInt(line));
    return containers;
}


const filePath = 'inputDay17.txt';
const containers = parseContainerData(filePath);
console.log(containers);

const target = 150;
const combinations = countCombinations(containers, target);
console.log('Number of combinations:', combinations);
