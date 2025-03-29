const fs = require("fs");

// Function to parse input data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim().split("\n\n");
    const samples = data.map(block => {
        const lines = block.split("\n");

        // Parse "Before:"
        const beforeMatch = lines[0].match(/Before:\[([\d, ]+)\]/);
        if (!beforeMatch) {
            throw new Error(`Invalid "Before" format: ${lines[0]}`);
        }
        const before = beforeMatch[1].split(", ").map(Number);

        // Parse instruction
        const instruction = lines[1].split(" ").map(Number);

        // Parse "After:"
        const afterMatch = lines[2].match(/After:\[([\d, ]+)\]/);
        if (!afterMatch) {
            throw new Error(`Invalid "After" format: ${lines[2]}`);
        }
        const after = afterMatch[1].split(", ").map(Number);

        return { before, instruction, after };
    });
    return samples;
}

// Opcodes implementation
const opcodes = {
    addr: (regs, a, b, c) => { regs[c] = regs[a] + regs[b]; },
    addi: (regs, a, b, c) => { regs[c] = regs[a] + b; },
    mulr: (regs, a, b, c) => { regs[c] = regs[a] * regs[b]; },
    muli: (regs, a, b, c) => { regs[c] = regs[a] * b; },
    banr: (regs, a, b, c) => { regs[c] = regs[a] & regs[b]; },
    bani: (regs, a, b, c) => { regs[c] = regs[a] & b; },
    borr: (regs, a, b, c) => { regs[c] = regs[a] | regs[b]; },
    bori: (regs, a, b, c) => { regs[c] = regs[a] | b; },
    setr: (regs, a, b, c) => { regs[c] = regs[a]; },
    seti: (regs, a, b, c) => { regs[c] = a; },
    gtir: (regs, a, b, c) => { regs[c] = a > regs[b] ? 1 : 0; },
    gtri: (regs, a, b, c) => { regs[c] = regs[a] > b ? 1 : 0; },
    gtrr: (regs, a, b, c) => { regs[c] = regs[a] > regs[b] ? 1 : 0; },
    eqir: (regs, a, b, c) => { regs[c] = a === regs[b] ? 1 : 0; },
    eqri: (regs, a, b, c) => { regs[c] = regs[a] === b ? 1 : 0; },
    eqrr: (regs, a, b, c) => { regs[c] = regs[a] === regs[b] ? 1 : 0; },
};

// Function to determine matching opcodes for a sample
function matchingOpcodes(sample) {
    const { before, instruction, after } = sample;
    const [opcode, a, b, c] = instruction;
    let matches = 0;

    for (const op in opcodes) {
        const regs = [...before]; // Copy registers
        opcodes[op](regs, a, b, c); // Apply opcode logic
        if (JSON.stringify(regs) === JSON.stringify(after)) {
            matches++;
        }
    }

    return matches;
}

// Main function to find the number of samples behaving like three or more opcodes
function findSamples(filePath) {
    const samples = parseData(filePath);
    let count = 0;

    for (const sample of samples) {
        if (matchingOpcodes(sample) >= 3) {
            count++;
        }
    }

    return count;
}

// Example usage
const inputFile = "inputDay16.txt"; // Replace with your input file path
const result = findSamples(inputFile);
console.log(`Number of samples behaving like three or more opcodes: ${result}`);
