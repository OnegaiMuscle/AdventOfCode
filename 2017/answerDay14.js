// Function to calculate the knot hash
function knotHash(input) {
  const lengths = [...input].map(char => char.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
  const list = Array.from({ length: 256 }, (_, i) => i);
  let currentPosition = 0;
  let skipSize = 0;

  for (let round = 0; round < 64; round++) {
      lengths.forEach(length => {
          for (let i = 0; i < length / 2; i++) {
              const a = (currentPosition + i) % list.length;
              const b = (currentPosition + length - 1 - i) % list.length;
              [list[a], list[b]] = [list[b], list[a]];
          }
          currentPosition = (currentPosition + length + skipSize) % list.length;
          skipSize++;
      });
  }

  const denseHash = [];
  for (let i = 0; i < 16; i++) {
      let xor = list[i * 16];
      for (let j = 1; j < 16; j++) {
          xor ^= list[i * 16 + j];
      }
      denseHash.push(xor);
  }

  return denseHash.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Convert hexadecimal string to binary representation
function hexToBinary(hex) {
  return hex.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
}

// Generate the disk grid
function generateGrid(keyString) {
  const grid = [];
  for (let i = 0; i < 128; i++) {
      const rowKey = `${keyString}-${i}`;
      const hash = knotHash(rowKey);
      const binaryRow = hexToBinary(hash);
      grid.push(binaryRow.split('').map(bit => parseInt(bit)));
  }
  return grid;
}

// Calculate the number of used squares on the disk grid
function calculateUsedSquares(grid) {
  let usedSquares = 0;
  grid.forEach(row => {
      usedSquares += row.filter(bit => bit === 1).length;
  });
  return usedSquares;
}

// Perform flood-fill to count regions
function countRegions(grid) {
  let regions = 0;

  function floodFill(x, y) {
      if (x < 0 || x >= 128 || y < 0 || y >= 128 || grid[x][y] === 0) {
          return;
      }
      grid[x][y] = 0; // Mark square as visited
      floodFill(x - 1, y); // Up
      floodFill(x + 1, y); // Down
      floodFill(x, y - 1); // Left
      floodFill(x, y + 1); // Right
  }

  for (let x = 0; x < 128; x++) {
      for (let y = 0; y < 128; y++) {
          if (grid[x][y] === 1) {
              regions++;
              floodFill(x, y);
          }
      }
  }

  return regions;
}

// Main function to calculate both answers
function main() {
  const keyString = 'jxqlasbh';
  const grid = generateGrid(keyString);

  // Calculate number of used squares
  const usedSquares = calculateUsedSquares(grid);
  console.log(`The number of used squares is: ${usedSquares}`);

  // Calculate number of regions
  const regions = countRegions(grid);
  console.log(`The number of regions is: ${regions}`);
}

// Execute the main function
main();

