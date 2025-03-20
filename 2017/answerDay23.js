
const fs = require('fs');

// Function to parse the input program from a text file
function parseProgram(filename) {
    const data = fs.readFileSync(filename, 'utf-8').trim();
    return data.split('\n').map(line => line.split(' '));
}

// Function to simulate the program and count `mul` instructions
function simulateProgram(instructions) {
    const registers = {}; // Registers a through h
    let mulCount = 0; // Counter for `mul` instructions
    let pointer = 0; // Instruction pointer

    // Initialize all registers to 0
    'abcdefgh'.split('').forEach(register => {
        registers[register] = 0;
    });

    while (pointer >= 0 && pointer < instructions.length) {
        const [cmd, x, y] = instructions[pointer];
        const yValue = isNaN(y) ? registers[y] || 0 : parseInt(y, 10); // Determine the value of y
        const xValue = isNaN(x) ? registers[x] || 0 : parseInt(x, 10); // Determine the value of x

        switch (cmd) {
            case 'set':
                registers[x] = yValue;
                break;
            case 'sub':
                registers[x] -= yValue;
                break;
            case 'mul':
                registers[x] *= yValue;
                mulCount++; // Count the `mul` instruction
                break;
            case 'jnz':
                if (xValue !== 0) {
                    pointer += yValue - 1; // Adjust the pointer for the jump
                }
                break;
            default:
                throw new Error(`Unknown command: ${cmd}`);
        }

        pointer++; // Move to the next instruction
    }

    return mulCount;
}

// Main function
function main() {
    const filename = 'inputDay23.txt'; // Replace with your actual input file name
    const instructions = parseProgram(filename);
    const result = simulateProgram(instructions);
    console.log(`The 'mul' instruction is invoked ${result} times.`);
}

// Run the main function
main();
