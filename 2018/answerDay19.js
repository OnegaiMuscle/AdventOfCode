// Function to parse input from a text file
function parseProgram(filename) {
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

// Operations based on opcodes
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

// Function to execute the program
function executeProgram(program, initialRegisters) {
  const { instructionPointer, instructions } = program;
  const registers = [...initialRegisters];

  while (registers[instructionPointer] >= 0 && registers[instructionPointer] < instructions.length) {
      const instruction = instructions[registers[instructionPointer]];
      operations[instruction.opcode](registers, instruction.a, instruction.b, instruction.c);
      registers[instructionPointer]++;
  }

  return registers[0];
}

// Example usage
const program = parseProgram('inputDay19.txt'); // Replace 'input.txt' with your file path

// Scenario 1: Register 0 starts at 0
const initialRegisters1 = [0, 0, 0, 0, 0, 0];
const result1 = executeProgram(program, initialRegisters1);
console.log('Value left in register 0 (starting with 0):', result1);

// Scenario 2: Register 0 starts at 1
const initialRegisters2 = [1, 0, 0, 0, 0, 0];
const result2 = executeProgram(program, initialRegisters2);
console.log('Value left in register 0 (starting with 1):', result2);
