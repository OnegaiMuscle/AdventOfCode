// Function to generate the next sequence in the look-and-say game
function lookAndSay(sequence) {
  let result = '';
  let count = 1;

  for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] === sequence[i + 1]) {
          count++;
      } else {
          result += count + sequence[i];
          count = 1;
      }
  }

  return result;
}

// Function to apply the look-and-say process n times
function applyLookAndSay(input, n) {
  let sequence = input;

  for (let i = 0; i < n; i++) {
      sequence = lookAndSay(sequence);
  }

  return sequence;
}

// Example usage
const input = '1113122113';
const iterations = 40;
const result = applyLookAndSay(input, iterations);
console.log(`The length of the result after ${iterations} iterations is: ${result.length}`);
const iterationss = 50;
const resultbis = applyLookAndSay(input, iterationss);
console.log(`The length of the result after ${iterations} iterations is: ${resultbis.length}`);
