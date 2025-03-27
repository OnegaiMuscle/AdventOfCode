
// Function to calculate power level of a single fuel cell
function calculatePowerLevel(x, y, serialNumber) {
  const rackID = x + 10;
  let powerLevel = rackID * y;
  powerLevel += serialNumber;
  powerLevel *= rackID;
  powerLevel = Math.floor((powerLevel % 1000) / 100); // Extract the hundreds digit
  return powerLevel - 5;
}

// Function to find the top-left coordinate of the 3x3 square with the highest total power
function findLargestPowerSquare(serialNumber) {
  const gridSize = 300;
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  // Precompute power levels for each cell
  for (let y = 1; y <= gridSize; y++) {
      for (let x = 1; x <= gridSize; x++) {
          grid[y - 1][x - 1] = calculatePowerLevel(x, y, serialNumber);
      }
  }

  let maxPower = Number.NEGATIVE_INFINITY;
  let topLeftCoordinate = [0, 0];

  // Iterate through all possible 3x3 squares
  for (let y = 0; y < gridSize - 2; y++) {
      for (let x = 0; x < gridSize - 2; x++) {
          let totalPower = 0;

          // Sum the power of the 3x3 square
          for (let dy = 0; dy < 3; dy++) {
              for (let dx = 0; dx < 3; dx++) {
                  totalPower += grid[y + dy][x + dx];
              }
          }

          // Update max power and coordinates
          if (totalPower > maxPower) {
              maxPower = totalPower;
              topLeftCoordinate = [x + 1, y + 1]; // Convert to 1-based indexing
          }
      }
  }

  return { topLeft: topLeftCoordinate, maxPower };
}

// Example usage
const serialNumber = 1723; // Puzzle input
const result = findLargestPowerSquare(serialNumber);

console.log(`Top-left coordinate: ${result.topLeft[0]},${result.topLeft[1]}`);
console.log(`Max power: ${result.maxPower}`);
