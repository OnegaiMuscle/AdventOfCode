const fs = require("fs");

// Function to parse input from a text file (used for the single round solution)
function parseInput(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return data.split(",").map(Number); // Split input by commas and convert to numbers
}

// Function to convert input string to ASCII codes and append suffix (used for the full Knot Hash)
function getLengths(input) {
  const suffix = [17, 31, 73, 47, 23];
  const asciiCodes = Array.from(input.trim()).map((char) => char.charCodeAt(0));
  return asciiCodes.concat(suffix);
}

// Function to perform the knot hash algorithm (single round)
function knotHashSingleRound(lengths, listSize = 256) {
  const list = Array.from({ length: listSize }, (_, i) => i); // Create a list [0, 1, ..., 255]
  let currentPosition = 0;
  let skipSize = 0;

  // Perform the operations based on the lengths
  for (const length of lengths) {
    // Reverse the segment of the list
    if (length > 0) {
      const indices = Array.from({ length }, (_, i) => (currentPosition + i) % listSize); // Get circular indices
      const sublist = indices.map(i => list[i]).reverse(); // Get and reverse the elements
      indices.forEach((i, idx) => (list[i] = sublist[idx])); // Place reversed elements back
    }

    // Update the current position and skip size
    currentPosition = (currentPosition + length + skipSize) % listSize;
    skipSize += 1;
  }

  // Return the result of multiplying the first two numbers
  return list[0] * list[1];
}

// Function to perform the knot hash algorithm for 64 rounds
function knotHashRounds(lengths, listSize = 256) {
  const list = Array.from({ length: listSize }, (_, i) => i);
  let currentPosition = 0;
  let skipSize = 0;

  for (let round = 0; round < 64; round++) {
    for (const length of lengths) {
      // Reverse the segment
      if (length > 0) {
        const indices = Array.from({ length }, (_, i) => (currentPosition + i) % listSize);
        const sublist = indices.map((i) => list[i]).reverse();
        indices.forEach((i, idx) => (list[i] = sublist[idx]));
      }

      // Update current position and skip size
      currentPosition = (currentPosition + length + skipSize) % listSize;
      skipSize += 1;
    }
  }

  return list;
}

// Function to compute dense hash from sparse hash
function computeDenseHash(sparseHash) {
  const denseHash = [];
  for (let i = 0; i < sparseHash.length; i += 16) {
    const block = sparseHash.slice(i, i + 16);
    denseHash.push(block.reduce((acc, num) => acc ^ num, 0)); // XOR each block
  }
  return denseHash;
}

// Function to convert dense hash to hexadecimal string
function toHexString(denseHash) {
  return denseHash.map((num) => num.toString(16).padStart(2, "0")).join("");
}

// Main function to compute the full Knot Hash
function knotHash(input) {
  const lengths = getLengths(input); // Convert input to lengths with suffix
  const sparseHash = knotHashRounds(lengths); // Perform 64 rounds
  const denseHash = computeDenseHash(sparseHash); // Reduce to dense hash
  return toHexString(denseHash); // Convert to hexadecimal representation
}

// Main Function to run both solutions
function main() {
  const filePath = "inputDay10.txt"; // Change this to the path of your input file

  // For the single round solution
  const singleRoundInput = parseInput(filePath);
  const singleRoundResult = knotHashSingleRound(singleRoundInput);
  console.log(`The result of the single round (first two numbers multiplied) is: ${singleRoundResult}`);

  // For the full Knot Hash solution
  const input = fs.readFileSync(filePath, "utf8"); // Read the input as string
  const fullHashResult = knotHash(input);
  console.log(`The full Knot Hash of the input is: ${fullHashResult}`);
}

main();
