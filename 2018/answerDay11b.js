// Function to calculate power level of a single fuel cell
function calculatePowerLevel(x, y, serialNumber) {
  const rackID = x + 10;
  let powerLevel = rackID * y;
  powerLevel += serialNumber;
  powerLevel *= rackID;
  powerLevel = Math.floor((powerLevel % 1000) / 100); // Extract the hundreds digit
  return powerLevel - 5;
}

// Function to create a summed-area table for quick calculations
function createSummedAreaTable(serialNumber) {
  const gridSize = 300;
  const table = Array.from({ length: gridSize + 1 }, () => Array(gridSize + 1).fill(0));

  for (let y = 1; y <= gridSize; y++) {
      for (let x = 1; x <= gridSize; x++) {
          const power = calculatePowerLevel(x, y, serialNumber);
          table[y][x] = power + table[y - 1][x] + table[y][x - 1] - table[y - 1][x - 1];
      }
  }

  return table;
}

// Function to calculate the total power of a square using the summed-area table
function getSquarePower(table, x, y, size) {
  const x1 = x - 1;
  const y1 = y - 1;
  const x2 = x + size - 1;
  const y2 = y + size - 1;

  return (
      table[y2][x2] -
      (table[y1] && table[y1][x2] || 0) -
      (table[y2][x1] || 0) +
      (table[y1] && table[y1][x1] || 0)
  );
}

// Function to find the square with the largest power (any size)
function findLargestPowerSquareAnySize(serialNumber) {
  const gridSize = 300;
  const table = createSummedAreaTable(serialNumber);

  let maxPower = Number.NEGATIVE_INFINITY;
  let bestCoordinate = [0, 0, 0]; // [x, y, size]

  // Iterate through all possible square sizes
  for (let size = 1; size <= gridSize; size++) {
      for (let y = 1; y <= gridSize - size + 1; y++) {
          for (let x = 1; x <= gridSize - size + 1; x++) {
              const power = getSquarePower(table, x, y, size);
              if (power > maxPower) {
                  maxPower = power;
                  bestCoordinate = [x, y, size];
              }
          }
      }
  }

  return { topLeft: bestCoordinate, maxPower };
}

// Example usage
const serialNumber = 1723; // Puzzle input
const result = findLargestPowerSquareAnySize(serialNumber);

console.log(`Largest total power square: ${result.topLeft.join(",")}`);
console.log(`Max power: ${result.maxPower}`);
