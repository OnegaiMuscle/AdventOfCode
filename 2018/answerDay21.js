// Function to parse the activation system program from a text file
function parseActivationProgram(filename) {
  const fs = require('fs');
  const input = fs.readFileSync(filename, 'utf-8').trim().split('\n');
  const instructionPointer = parseInt(input[0].split(' ')[1], 10);
  const instructions = input.slice(1).map(line => {
      const parts = line.split(' ');
      return {
          opcode: parts[0],
          a: parseInt(parts[1], 10),
          b: parseInt(parts[2], 10),
          c: parseInt(parts[3], 10),
      };
  });
  return { instructionPointer, instructions };
}

// Operations for the activation system
const operations = {
  addr: (registers, a, b, c) => { registers[c] = registers[a] + registers[b]; },
  addi: (registers, a, b, c) => { registers[c] = registers[a] + b; },
  mulr: (registers, a, b, c) => { registers[c] = registers[a] * registers[b]; },
  muli: (registers, a, b, c) => { registers[c] = registers[a] * b; },
  banr: (registers, a, b, c) => { registers[c] = registers[a] & registers[b]; },
  bani: (registers, a, b, c) => { registers[c] = registers[a] & b; },
  borr: (registers, a, b, c) => { registers[c] = registers[a] | registers[b]; },
  bori: (registers, a, b, c) => { registers[c] = registers[a] | b; },
  setr: (registers, a, b, c) => { registers[c] = registers[a]; },
  seti: (registers, a, b, c) => { registers[c] = a; },
  gtir: (registers, a, b, c) => { registers[c] = a > registers[b] ? 1 : 0; },
  gtri: (registers, a, b, c) => { registers[c] = registers[a] > b ? 1 : 0; },
  gtrr: (registers, a, b, c) => { registers[c] = registers[a] > registers[b] ? 1 : 0; },
  eqir: (registers, a, b, c) => { registers[c] = a === registers[b] ? 1 : 0; },
  eqri: (registers, a, b, c) => { registers[c] = registers[a] === b ? 1 : 0; },
  eqrr: (registers, a, b, c) => { registers[c] = registers[a] === registers[b] ? 1 : 0; },
};

// Function to execute the program and find the lowest integer for register 0
function findLowestInteger(program) {
  const { instructionPointer, instructions } = program;
  const seenValues = new Set();
  let registers = [0, 0, 0, 0, 0, 0];
  let lastHaltedValue = null;

  while (true) {
      const ip = registers[instructionPointer];
      if (ip < 0 || ip >= instructions.length) break;

      const instruction = instructions[ip];
      operations[instruction.opcode](registers, instruction.a, instruction.b, instruction.c);

      // Specific behavior when halting is detected
      if (instruction.opcode === 'eqrr') { // Halting instruction
          const haltedValue = registers[instruction.a];
          if (seenValues.has(haltedValue)) {
              return lastHaltedValue; // Return the first halting value
          }
          seenValues.add(haltedValue);
          lastHaltedValue = haltedValue;
      }

      registers[instructionPointer]++;
  }
}

// Example usage with your provided input
const program = parseActivationProgram('inputDay21.txt'); // Ensure your file contains the provided sample
const lowestInteger = findLowestInteger(program);
console.log('Lowest non-negative integer for register 0:', lowestInteger);
