const fs = require('fs');

// Function to parse the input program from a text file
function parseProgram(filename) {
    const data = fs.readFileSync(filename, 'utf-8').trim();
    return data.split('\n').map(line => line.split(' '));
}

// Part 1: Count `mul` instruction invocations
function simulateProgramPart1(instructions) {
    const registers = {}; // Registers a through h
    let mulCount = 0; // Counter for `mul` instructions
    let pointer = 0; // Instruction pointer

    // Initialize all registers to 0
    'abcdefgh'.split('').forEach(register => {
        registers[register] = 0;
    });

    while (pointer >= 0 && pointer < instructions.length) {
        const [cmd, x, y] = instructions[pointer];
        const yValue = isNaN(y) ? registers[y] || 0 : parseInt(y, 10);
        const xValue = isNaN(x) ? registers[x] || 0 : parseInt(x, 10);

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

// Part 2: Optimize to calculate the final value of register h
function calculateHOptimized() {
    // Analysis of the program:
    // The program calculates how many non-prime numbers exist in a range of values.
    let h = 0;
    const bStart = 108400; // The initial value of b
    const bEnd = 125400;   // The final value of b
    const step = 17;       // Increment step for b

    for (let b = bStart; b <= bEnd; b += step) {
        if (!isPrime(b)) {
            h++;
        }
    }

    return h;
}

// Helper function to determine if a number is prime
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Main function
function main() {
    const filename = 'inputDay23.txt'; // Replace with your actual input file name
    const instructions = parseProgram(filename);

    // Part 1: Count the `mul` instructions
    const resultPart1 = simulateProgramPart1(instructions);
    console.log(`The 'mul' instruction is invoked ${resultPart1} times.`);

    // Part 2: Calculate the final value of register h
    const resultPart2 = calculateHOptimized();
    console.log(`The final value in register h is ${resultPart2}.`);
}

// Run the main function
main();
