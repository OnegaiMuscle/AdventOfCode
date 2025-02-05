function isWall(x, y, favoriteNumber) {
  const value = x * x + 3 * x + 2 * x * y + y + y * y + favoriteNumber;
  const binaryRepresentation = value.toString(2);
  const numberOfOnes = binaryRepresentation.split('1').length - 1;
  return numberOfOnes % 2 !== 0;
}

function findShortestPath(favoriteNumber, startX, startY, targetX, targetY) {
  const queue = [{ x: startX, y: startY, steps: 0 }];
  const visited = new Set([`${startX},${startY}`]);
  const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 }
  ];

  while (queue.length > 0) {
      const { x, y, steps } = queue.shift();

      if (x === targetX && y === targetY) {
          return steps;
      }

      for (const { dx, dy } of directions) {
          const newX = x + dx;
          const newY = y + dy;

          if (newX >= 0 && newY >= 0 && !isWall(newX, newY, favoriteNumber) && !visited.has(`${newX},${newY}`)) {
              queue.push({ x: newX, y: newY, steps: steps + 1 });
              visited.add(`${newX},${newY}`);
          }
      }
  }

  return -1; // Si aucune solution n'est trouvée
}

const favoriteNumber = 1350;
const startX = 1;
const startY = 1;
const targetX = 31;
const targetY = 39;
const result = findShortestPath(favoriteNumber, startX, startY, targetX, targetY);

console.log(`Le nombre minimum de pas nécessaires pour atteindre (${targetX}, ${targetY}) est ${result}`);

function reachableLocations(favoriteNumber, startX, startY, maxSteps) {
  const queue = [{ x: startX, y: startY, steps: 0 }];
  const visited = new Set([`${startX},${startY}`]);
  const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 }
  ];

  while (queue.length > 0) {
      const { x, y, steps } = queue.shift();
      if (steps >= maxSteps) continue;

      for (const { dx, dy } of directions) {
          const newX = x + dx;
          const newY = y + dy;

          if (newX >= 0 && newY >= 0 && !isWall(newX, newY, favoriteNumber) && !visited.has(`${newX},${newY}`)) {
              queue.push({ x: newX, y: newY, steps: steps + 1 });
              visited.add(`${newX},${newY}`);
          }
      }
  }

  return visited.size;
}


const maxSteps = 50;
const resultbis = reachableLocations(favoriteNumber, startX, startY, maxSteps);

console.log(`Le nombre de lieux que tu peux atteindre en au plus ${maxSteps} pas est ${resultbis}`)
