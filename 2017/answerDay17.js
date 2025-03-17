function spinlock(steps, limit) {
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

// Example usage
const steps = 343; // Your puzzle input
const limit = 2017; // Total number of insertions
const result = spinlock(steps, limit);
console.log(`The value after 2017 is: ${result}`);

