function parseHappinessData(input) {
  const lines = input.trim().split('\n');
  const happinessMap = {};
  const guests = new Set();

  lines.forEach(line => {
      const parts = line.match(/(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\./);
      if (parts) {
          const [_, person1, gainOrLose, units, person2] = parts;
          const happinessUnits = gainOrLose === 'gain' ? parseInt(units) : -parseInt(units);

          if (!happinessMap[person1]) {
              happinessMap[person1] = {};
          }
          happinessMap[person1][person2] = happinessUnits;

          guests.add(person1);
          guests.add(person2);
      }
  });

  // Add yourself to the happiness map with 0 happiness units for all relationships
  const yourself = 'You';
  guests.forEach(guest => {
      if (!happinessMap[guest]) {
          happinessMap[guest] = {};
      }
      happinessMap[guest][yourself] = 0;
      if (!happinessMap[yourself]) {
          happinessMap[yourself] = {};
      }
      happinessMap[yourself][guest] = 0;
  });
  guests.add(yourself);

  return { happinessMap, guests: Array.from(guests) };
}

function calculateHappiness(arrangement, happinessMap) {
  let totalHappiness = 0;
  const n = arrangement.length;
  for (let i = 0; i < n; i++) {
      const leftNeighbor = arrangement[(i - 1 + n) % n];
      const rightNeighbor = arrangement[(i + 1) % n];
      totalHappiness += happinessMap[arrangement[i]][leftNeighbor];
      totalHappiness += happinessMap[arrangement[i]][rightNeighbor];
  }
  return totalHappiness;
}

function findOptimalSeating(guests, happinessMap) {
  const permutations = permute(guests);
  let maxHappiness = -Infinity;
  let optimalArrangement = [];

  for (const arrangement of permutations) {
      const happiness = calculateHappiness(arrangement, happinessMap);
      if (happiness > maxHappiness) {
          maxHappiness = happiness;
          optimalArrangement = arrangement;
      }
  }

  return { optimalArrangement, maxHappiness };
}

function permute(arr) {
  if (arr.length === 0) return [[]];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
      const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
      for (const perm of rest) {
          result.push([arr[i], ...perm]);
      }
  }
  return result;
}

const fs = require('fs');
const input = fs.readFileSync('inputDay13.txt', 'utf8');

const { happinessMap, guests } = parseHappinessData(input);
const { optimalArrangement, maxHappiness } = findOptimalSeating(guests, happinessMap);
console.log('Optimal Arrangement:', optimalArrangement);
console.log('Max Happiness:', maxHappiness);
