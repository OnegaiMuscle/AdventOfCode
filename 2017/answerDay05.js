
const fs = require('fs');

// Function to parse data from the txt file and compute the steps
function countStepsToExit(filePath) {
  // Read and parse the input data
  const instructions = fs.readFileSync(filePath, 'utf-8')
    .split('\n') // Split by lines
    .map(line => parseInt(line.trim(), 10)) // Convert each line to an integer
    .filter(num => !isNaN(num)); // Filter out invalid values

  let steps = 0;
  let position = 0;

  // Execute the jumps until we exit the list
  while (position >= 0 && position < instructions.length) {
    const jump = instructions[position];
    instructions[position]++;
    position += jump;
    steps++;
  }

  return steps;
}


const filePath = 'inputDay05.txt';
const stepsToExit = countStepsToExit(filePath);

console.log("Steps to exit:", stepsToExit);



function countStepsToExitbis(filePath) {
  const instructions = fs.readFileSync(filePath, 'utf-8')
    .split('\n') // Split by lines
    .map(line => parseInt(line.trim(), 10)) // Convert each line to an integer
    .filter(num => !isNaN(num)); // Filter out invalid values

  let steps = 0;
  let position = 0;

  // Execute the jumps until we exit the list
  while (position >= 0 && position < instructions.length) {
    const jump = instructions[position];

    // Apply the new rule: increase or decrease based on offset value
    if (jump >= 3) {
      instructions[position] -= 1;
    } else {
      instructions[position] += 1;
    }

    position += jump; // Move to the new position
    steps++; // Increment step counter
  }

  return steps;
}


const stepsToExitbis = countStepsToExitbis(filePath);

console.log("Steps to exit:", stepsToExitbis);
