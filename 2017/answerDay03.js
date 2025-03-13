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

