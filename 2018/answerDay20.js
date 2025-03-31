// Function to parse the regex from a text file
function parseRegex(filename) {
  const fs = require('fs');
  return fs.readFileSync(filename, 'utf-8').trim();
}

// Directional offsets for moving in the grid
const directions = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

// Function to build the map and calculate distances
function buildFacilityMap(regex) {
  const map = new Map(); // Tracks rooms and their connections
  let x = 0, y = 0; // Starting position
  const stack = []; // Stack for branches
  let startX = x, startY = y;

  // Helper function to update the map
  const addDoor = (x1, y1, x2, y2) => {
      const key1 = `${x1},${y1}`;
      const key2 = `${x2},${y2}`;
      if (!map.has(key1)) map.set(key1, []);
      if (!map.has(key2)) map.set(key2, []);
      map.get(key1).push(key2);
      map.get(key2).push(key1);
  };

  // Process the regex
  for (const char of regex) {
      if (char === '^' || char === '$') continue; // Ignore start and end markers
      if (char === '(') {
          stack.push([x, y]); // Save current position
      } else if (char === ')') {
          [x, y] = stack.pop(); // Restore position
      } else if (char === '|') {
          [x, y] = stack[stack.length - 1]; // Go back to branch start
      } else {
          const [dx, dy] = directions[char];
          const nextX = x + dx, nextY = y + dy;
          addDoor(x, y, nextX, nextY);
          x = nextX; y = nextY;
      }
  }

  // Calculate distances using breadth-first search (BFS)
  const distances = new Map();
  const queue = [[startX, startY]];
  distances.set(`${startX},${startY}`, 0);

  while (queue.length > 0) {
      const [curX, curY] = queue.shift();
      const curKey = `${curX},${curY}`;
      const curDistance = distances.get(curKey);

      for (const neighbor of map.get(curKey) || []) {
          if (!distances.has(neighbor)) {
              distances.set(neighbor, curDistance + 1);
              const [nx, ny] = neighbor.split(',').map(Number);
              queue.push([nx, ny]);
          }
      }
  }

  return {
      map,
      distances,
  };
}

// Function to analyze the facility
function analyzeFacility(regex) {
  const { distances } = buildFacilityMap(regex);

  // Find the furthest room
  let furthestDistance = 0;
  let roomsAtLeast1000Doors = 0;

  for (const distance of distances.values()) {
      if (distance > furthestDistance) {
          furthestDistance = distance;
      }
      if (distance >= 1000) {
          roomsAtLeast1000Doors++;
      }
  }

  return {
      furthestDistance,
      roomsAtLeast1000Doors,
  };
}

// Example usage
const filename = 'inputDay20.txt'; // Replace with the actual path to your input file
const regex = parseRegex(filename);
const result = analyzeFacility(regex);

console.log('Furthest room requires passing through', result.furthestDistance, 'doors.');
console.log('Number of rooms with at least 1000 doors:', result.roomsAtLeast1000Doors);
