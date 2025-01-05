console.time('Execution Time');

const fs = require('fs');
const data = fs.readFileSync('inputDay01.txt', 'utf8');

const valueFrequency = [...data].reduce((acc, value) => {
  acc[value] = (acc[value] || 0) + 1;
  return acc;
}, {});

console.log('answer01:', valueFrequency['('] - valueFrequency[')']);

function findBasementPosition(instructions) {
  let floor = 0;
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i] === '(') {
      floor += 1;
    } else if (instructions[i] === ')') {
      floor -= 1;
    };
    if (floor === -1) return i + 1;
  };
  return "not found";
};

console.log('answer02:', findBasementPosition(data));

console.timeEnd('Execution Time');
