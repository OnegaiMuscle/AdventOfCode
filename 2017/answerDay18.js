const fs = require('fs');

// Function to parse the instructions from a text file
function parseInstructions(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.trim().split('\n').map(line => line.split(' '));
}

// Function to get the value (either from a register or a number)
function getValue(registers, operand) {
    if (isNaN(operand)) {
        return registers[operand] || 0; // Return value of the register (default to 0)
    }
    return parseInt(operand, 10); // If it's a number, return the number
}

// Part 1: Execute the program to find the first recovered frequency
function executeInstructionsPart1(instructions) {
    const registers = {};
    let lastSound = null;
    let pointer = 0;

    while (pointer >= 0 && pointer < instructions.length) {
        const [cmd, x, y] = instructions[pointer];

        switch (cmd) {
            case 'snd': // Play a sound
                lastSound = getValue(registers, x);
                break;

            case 'set': // Set X to the value of Y
                registers[x] = getValue(registers, y);
                break;

            case 'add': // Add the value of Y to X
                registers[x] = (registers[x] || 0) + getValue(registers, y);
                break;

            case 'mul': // Multiply X by the value of Y
                registers[x] = (registers[x] || 0) * getValue(registers, y);
                break;

            case 'mod': // Modulo X by the value of Y
                registers[x] = (registers[x] || 0) % getValue(registers, y);
                break;

            case 'rcv': // Recover the last sound if X is not zero
                if (getValue(registers, x) !== 0) {
                    return lastSound; // Return the first recovered frequency
                }
                break;

            case 'jgz': // Jump if X is greater than 0
                if (getValue(registers, x) > 0) {
                    pointer += getValue(registers, y) - 1;
                }
                break;
        }

        pointer++;
    }

    return null; // No frequency recovered
}

// Part 2: Simulate two programs running concurrently
function executeInstructionsPart2(instructions) {
    const program0 = { registers: { p: 0 }, queue: [], pointer: 0, sendCount: 0, waiting: false };
    const program1 = { registers: { p: 1 }, queue: [], pointer: 0, sendCount: 0, waiting: false };

    // Helper function to execute a single step of a program
    function executeStep(program, otherProgram) {
        const { registers, queue } = program;

        if (program.pointer < 0 || program.pointer >= instructions.length) {
            program.waiting = true; // Out of bounds, program stops
            return;
        }

        const [cmd, x, y] = instructions[program.pointer];

        switch (cmd) {
            case 'snd': // Send value to the other program
                otherProgram.queue.push(getValue(registers, x));
                program.sendCount++;
                break;

            case 'set': // Set X to the value of Y
                registers[x] = getValue(registers, y);
                break;

            case 'add': // Add the value of Y to X
                registers[x] = (registers[x] || 0) + getValue(registers, y);
                break;

            case 'mul': // Multiply X by the value of Y
                registers[x] = (registers[x] || 0) * getValue(registers, y);
                break;

            case 'mod': // Modulo X by the value of Y
                registers[x] = (registers[x] || 0) % getValue(registers, y);
                break;

            case 'rcv': // Receive value from the queue
                if (queue.length > 0) {
                    registers[x] = queue.shift();
                } else {
                    program.waiting = true; // Wait if no value is available
                    return;
                }
                break;

            case 'jgz': // Jump if X is greater than 0
                if (getValue(registers, x) > 0) {
                    program.pointer += getValue(registers, y) - 1;
                }
                break;
        }

        program.waiting = false; // Reset waiting flag if instruction executed
        program.pointer++; // Move to the next instruction
    }

    // Simulate both programs
    while (!(program0.waiting && program1.waiting && program0.queue.length === 0 && program1.queue.length === 0)) {
        executeStep(program0, program1);
        executeStep(program1, program0);
    }

    return program1.sendCount; // Return the number of times program 1 sent a value
}

// Main function
function main() {
    const filename = 'inputDay18.txt'; // Replace with your input file name
    const instructions = parseInstructions(filename);

    // Part 1: Find the first recovered frequency
    const recoveredFrequency = executeInstructionsPart1(instructions);
    console.log(`The recovered frequency is: ${recoveredFrequency}`);

    // Part 2: Count how many times program 1 sends a value
    const program1SendCount = executeInstructionsPart2(instructions);
    console.log(`Program 1 sent values ${program1SendCount} times.`);
}

// Execute the main function
main();
