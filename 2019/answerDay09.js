const fs = require('fs');

// Function to parse Intcode program from a text file
function parseProgram(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    return data.split(',').map(Number);
}

// Function to execute the Intcode program with relative mode support
function runIntcode(program, inputValue) {
    let memory = [...program]; // Extend memory beyond initial program
    let pointer = 0;
    let relativeBase = 0;
    let inputs = [inputValue];
    let output = [];

    const getParam = (mode, index) => {
        if (mode === 0) return memory[memory[pointer + index] || 0] || 0; // Position mode
        if (mode === 1) return memory[pointer + index] || 0; // Immediate mode
        if (mode === 2) return memory[relativeBase + (memory[pointer + index] || 0)] || 0; // Relative mode
        return 0;
    };

    const setParam = (mode, index, value) => {
        if (mode === 0) memory[memory[pointer + index] || 0] = value; // Position mode
        if (mode === 2) memory[relativeBase + (memory[pointer + index] || 0)] = value; // Relative mode
    };

    while (memory[pointer] !== 99) {
        const opcode = memory[pointer] % 100;
        const modes = Math.floor(memory[pointer] / 100)
            .toString()
            .padStart(3, '0')
            .split('')
            .reverse()
            .map(Number);

        if (opcode === 1) { // Addition
            setParam(modes[2], 3, getParam(modes[0], 1) + getParam(modes[1], 2));
            pointer += 4;
        } else if (opcode === 2) { // Multiplication
            setParam(modes[2], 3, getParam(modes[0], 1) * getParam(modes[1], 2));
            pointer += 4;
        } else if (opcode === 3) { // Input
            if (inputs.length === 0) throw new Error("No input available.");
            setParam(modes[0], 1, inputs.shift());
            pointer += 2;
        } else if (opcode === 4) { // Output
            output.push(getParam(modes[0], 1));
            pointer += 2;
        } else if (opcode === 5) { // Jump-if-true
            pointer = getParam(modes[0], 1) !== 0 ? getParam(modes[1], 2) : pointer + 3;
        } else if (opcode === 6) { // Jump-if-false
            pointer = getParam(modes[0], 1) === 0 ? getParam(modes[1], 2) : pointer + 3;
        } else if (opcode === 7) { // Less than
            setParam(modes[2], 3, getParam(modes[0], 1) < getParam(modes[1], 2) ? 1 : 0);
            pointer += 4;
        } else if (opcode === 8) { // Equals
            setParam(modes[2], 3, getParam(modes[0], 1) === getParam(modes[1], 2) ? 1 : 0);
            pointer += 4;
        } else if (opcode === 9) { // Adjust relative base
            relativeBase += getParam(modes[0], 1);
            pointer += 2;
        } else {
            throw new Error(`Unknown opcode: ${opcode} at position ${pointer}`);
        }
    }

    return output;
}

// Main execution
function main() {
    const filePath = 'inputDay09.txt'; // Update to correct file name
    const program = parseProgram(filePath);

    // Run BOOST program in test mode (input = 1)
    const boostKeycode = runIntcode(program, 1);
    console.log(`BOOST Keycode: ${boostKeycode}`);

    // Run BOOST program in sensor boost mode (input = 2)
    const distressSignalCoords = runIntcode(program, 2);
    console.log(`Distress Signal Coordinates: ${distressSignalCoords}`);
}

main();
