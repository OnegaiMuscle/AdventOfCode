function calculateManhattanDistance(input) {
  // Determine the layer of the spiral the input is on
  let layer = 0;
  while ((2 * layer + 1) ** 2 < input) {
      layer++;
  }

  // Calculate the maximum value in the current layer's square
  const maxInLayer = (2 * layer + 1) ** 2;

  // Length of a side in the current layer
  const sideLength = 2 * layer;

  // Position of the input value in the current layer
  const positionInLayer = maxInLayer - input;

  // Find the offset from the middle of the closest side
  const offset = Math.abs(positionInLayer % sideLength - layer);

  // Manhattan Distance is the layer number + the offset
  return layer + offset;
}

// Example usage
const puzzleInput = 325489;
const distance = calculateManhattanDistance(puzzleInput);
console.log('Manhattan Distance:', distance);

function findFirstLargerValue(input) {
  const grid = new Map();

  // Helper function to compute grid key for x, y coordinates
  const getKey = (x, y) => `${x},${y}`;

  // Store the value 1 at the origin
  grid.set(getKey(0, 0), 1);

  let x = 0, y = 0;
  let direction = 0; // 0: right, 1: up, 2: left, 3: down
  let steps = 1; // Initial number of steps in each direction

  const directions = [
      [1, 0],  // Right
      [0, -1], // Up
      [-1, 0], // Left
      [0, 1]   // Down
  ];

  while (true) {
      for (let i = 0; i < 2; i++) { // Each step length applies to two directions
          for (let j = 0; j < steps; j++) {
              // Move in the current direction
              x += directions[direction][0];
              y += directions[direction][1];

              // Calculate the sum of all adjacent squares
              let sum = 0;
              for (let dx = -1; dx <= 1; dx++) {
                  for (let dy = -1; dy <= 1; dy++) {
                      if (dx !== 0 || dy !== 0) { // Exclude the current square
                          sum += grid.get(getKey(x + dx, y + dy)) || 0;
                      }
                  }
              }

              // Store the sum in the current square
              grid.set(getKey(x, y), sum);

              // Check if the sum is larger than the input
              if (sum > input) {
                  return sum;
              }
          }
          // Change direction (right -> up -> left -> down -> right ...)
          direction = (direction + 1) % 4;
      }

      // Increase the number of steps after completing two directions
      steps++;
  }
}

// Example usage

const result = findFirstLargerValue(puzzleInput);
console.log('First value larger than puzzle input:', result);
