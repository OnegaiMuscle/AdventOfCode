const fs = require("fs");

// Function to parse the path from a text file
function parsePath(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return data.trim().split(","); // Read file, trim whitespace, split directions by commas
}

// Function to calculate the fewest number of steps to the destination and the maximum distance reached
function calculateStepsAndMaxDistance(path) {
  // Initialize starting coordinates
  let x = 0, y = 0, z = 0;
  let maxDistance = 0;

  // Define movement mappings
  const moves = {
    n: [0, 1, -1],
    ne: [1, 0, -1],
    se: [1, -1, 0],
    s: [0, -1, 1],
    sw: [-1, 0, 1],
    nw: [-1, 1, 0],
  };

  // Follow the path
  for (const direction of path) {
    const [dx, dy, dz] = moves[direction];
    x += dx;
    y += dy;
    z += dz;

    // Calculate the current distance from the starting position
    const currentDistance = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;

    // Update the maximum distance if the current distance is greater
    maxDistance = Math.max(maxDistance, currentDistance);
  }

  // Calculate the final distance from the origin
  const finalDistance = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;

  return { finalDistance, maxDistance };
}

// Main function
function main() {
  const filePath = "inputDay11.txt"; // Specify the path to your input file
  const path = parsePath(filePath);
  const { finalDistance, maxDistance } = calculateStepsAndMaxDistance(path);
  console.log(`The fewest number of steps required to reach the child process is: ${finalDistance}`);
  console.log(`The furthest he ever got from the starting position is: ${maxDistance}`);
}

main();
