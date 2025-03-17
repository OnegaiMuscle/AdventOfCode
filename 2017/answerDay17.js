// Function to find the value after 2017
function spinlockValueAfter2017(steps, limit) {
  const buffer = [0]; // Start with the initial state of the circular buffer
  let currentPosition = 0;

  for (let value = 1; value <= limit; value++) {
      // Step forward through the buffer
      currentPosition = (currentPosition + steps) % buffer.length;

      // Insert the new value after the current position
      buffer.splice(currentPosition + 1, 0, value);

      // Update the current position to the new value
      currentPosition++;
  }

  // Return the value after 2017
  const value2017Index = buffer.indexOf(2017);
  return buffer[(value2017Index + 1) % buffer.length];
}

// Function to find the value after 0 in a virtual circular buffer after 50 million insertions
function spinlockValueAfterZero(steps, limit) {
  let currentPosition = 0;
  let valueAfterZero = -1;

  for (let value = 1; value <= limit; value++) {
      // Step forward through the virtual buffer
      currentPosition = (currentPosition + steps) % value;

      // If 0 is the current position, update the value after 0
      if (currentPosition === 0) {
          valueAfterZero = value;
      }

      // Update the current position to the next value
      currentPosition++;
  }

  return valueAfterZero;
}

// Main function
function main() {
  const steps = 343; // Your puzzle input

  // Task 1: Find the value after 2017
  const limit2017 = 2017; // Total number of insertions for the first task
  const valueAfter2017 = spinlockValueAfter2017(steps, limit2017);
  console.log(`The value after 2017 is: ${valueAfter2017}`);

  // Task 2: Find the value after 0 after 50 million insertions
  const limit50Million = 50000000; // Total number of insertions for the second task
  const valueAfterZero = spinlockValueAfterZero(steps, limit50Million);
  console.log(`The value after 0 after 50 million insertions is: ${valueAfterZero}`);
}

// Execute the main function
main();
