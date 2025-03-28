function findScoresAfterRecipes(input) {
  const scores = [3, 7]; // Initial scores
  let elf1 = 0; // Index of the first Elf
  let elf2 = 1; // Index of the second Elf

  while (scores.length < input + 10) {
      // Calculate the sum of the current recipes
      const sum = scores[elf1] + scores[elf2];

      // Add the digits of the sum to the scoreboard
      if (sum >= 10) {
          scores.push(1); // Push the tens digit
      }
      scores.push(sum % 10); // Push the ones digit

      // Move each Elf to a new recipe
      elf1 = (elf1 + 1 + scores[elf1]) % scores.length;
      elf2 = (elf2 + 1 + scores[elf2]) % scores.length;
  }

  // Extract the scores of the ten recipes after the given input
  return scores.slice(input, input + 10).join("");
}

function findRecipesBeforeSequence(sequence) {
  const scores = [3, 7]; // Initial scores
  let elf1 = 0; // Index of the first Elf
  let elf2 = 1; // Index of the second Elf
  const sequenceLength = sequence.length;

  while (true) {
      // Calculate the sum of the current recipes
      const sum = scores[elf1] + scores[elf2];

      // Add the digits of the sum to the scoreboard
      if (sum >= 10) {
          scores.push(1); // Push the tens digit
          if (scores.slice(-sequenceLength).join("") === sequence) {
              return scores.length - sequenceLength; // Found sequence
          }
      }
      scores.push(sum % 10); // Push the ones digit
      if (scores.slice(-sequenceLength).join("") === sequence) {
          return scores.length - sequenceLength; // Found sequence
      }

      // Move each Elf to a new recipe
      elf1 = (elf1 + 1 + scores[elf1]) % scores.length;
      elf2 = (elf2 + 1 + scores[elf2]) % scores.length;
  }
}

// Puzzle input
const input = 440231;
const resultPart1 = findScoresAfterRecipes(input);
const resultPart2 = findRecipesBeforeSequence(input.toString());

console.log(`The scores of the ten recipes after ${input} recipes are: ${resultPart1}`);
console.log(`The number of recipes before the sequence ${input} is: ${resultPart2}`);
