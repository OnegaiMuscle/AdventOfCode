const fs = require("fs");

// Function to parse the input data from a text file
function parseInput(filePath) {
  const data = fs.readFileSync(filePath, "utf8").trim();
  const connections = {};

  // Parse each line to extract program ID and its connections
  data.split("\n").forEach((line) => {
    const [program, neighbors] = line.split(" <-> ");
    connections[program] = neighbors.split(", ").map(Number);
  });

  return connections;
}

// Function to find all programs in the same group as a given startID
function findGroup(connections, startID) {
  const visited = new Set();
  const queue = [startID];

  while (queue.length > 0) {
    const program = queue.shift();
    if (!visited.has(program)) {
      visited.add(program);
      queue.push(...connections[program].filter((neighbor) => !visited.has(neighbor)));
    }
  }

  return visited;
}

// Function to count the total number of groups
function countGroups(connections) {
  const visitedPrograms = new Set();
  let groupCount = 0;

  // Iterate over all programs
  for (const program in connections) {
    if (!visitedPrograms.has(Number(program))) {
      const group = findGroup(connections, Number(program));
      group.forEach((prog) => visitedPrograms.add(prog));
      groupCount++; // Increment the group count for each new group found
    }
  }

  return groupCount;
}

// Main function
function main() {
  const filePath = "inputDay12.txt"; // Specify the path to your input file
  const connections = parseInput(filePath);

  // Part 1: Find the size of the group that contains program ID 0
  const groupContainingZero = findGroup(connections, 0);
  console.log(`The size of the group that contains program ID 0 is: ${groupContainingZero.size}`);

  // Part 2: Count the total number of groups
  const totalGroups = countGroups(connections);
  console.log(`The total number of groups is: ${totalGroups}`);
}

main();
