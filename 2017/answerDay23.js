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

// Part 2: Optimized Prime Calculation for Register h
function calculateHOptimized() {
    let h = 0;
    const bStart = 108400; // Start value for b
    const bEnd = 125400;   // End value for b
    const step = 17;       // Step value for b

    for (let b = bStart; b <= bEnd; b += step) {
        if (!isPrime(b)) {
            h++;
        }
    }

    return h;
}

// Optimized Prime Check with Memoization
const primeCache = new Map();

function isPrime(n) {
    if (n < 2) return false;
    if (primeCache.has(n)) return primeCache.get(n);

    // Check divisors up to the square root of n
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            primeCache.set(n, false);
            return false;
        }
    }

    primeCache.set(n, true);
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
