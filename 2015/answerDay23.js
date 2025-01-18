function runProgram(instructions) {
  let registers = { a: 0, b: 0 };
  let pointer = 0;

  while (pointer >= 0 && pointer < instructions.length) {
      let [instruction, arg1, arg2] = instructions[pointer].split(' ');

      switch (instruction) {
          case 'hlf':
              registers[arg1] = Math.floor(registers[arg1] / 2);
              pointer++;
              break;
          case 'tpl':
              registers[arg1] *= 3;
              pointer++;
              break;
          case 'inc':
              registers[arg1]++;
              pointer++;
              break;
          case 'jmp':
              pointer += parseInt(arg1);
              break;
          case 'jie':
              if (registers[arg1] % 2 === 0) {
                  pointer += parseInt(arg2);
              } else {
                  pointer++;
              }
              break;
          case 'jio':
              if (registers[arg1] === 1) {
                  pointer += parseInt(arg2);
              } else {
                  pointer++;
              }
              break;
          default:
              throw new Error(`Unknown instruction: ${instruction}`);
      }
  }

  return registers.b;
}

const fs = require('fs');

function parseInstructions(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const instructions = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        return instructions;
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return [];
    }
}

// Example usage:
const filePath = 'inputDay23.txt';
const instructions = parseInstructions(filePath);
console.log(instructions);


console.log(runProgram(instructions)); // Output: 0
