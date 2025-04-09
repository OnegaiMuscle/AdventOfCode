const fs = require('fs');

// Function to parse Intcode program from a text file
function parseProgram(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split(',').map(Number);
}

// Function to execute an Intcode program with given inputs, returning output & new state
function runIntcode(program, inputs) {
    let memory = [...program];
    let inputIndex = 0;
    let output = null;
    let pointer = 0;

    while (memory[pointer] !== 99) {
        const opcode = memory[pointer] % 100;
        const modes = Math.floor(memory[pointer] / 100).toString().padStart(3, '0').split('').reverse().map(Number);

        const getParam = (index) => modes[index] ? memory[pointer + index + 1] : memory[memory[pointer + index + 1]];
        const setParam = (index, value) => memory[memory[pointer + index + 1]] = value;

        if (opcode === 1) {  // Addition
            setParam(2, getParam(0) + getParam(1));
            pointer += 4;
        } else if (opcode === 2) {  // Multiplication
            setParam(2, getParam(0) * getParam(1));
            pointer += 4;
        } else if (opcode === 3) {  // Input
            if (inputIndex < inputs.length) {
                setParam(0, inputs[inputIndex++]);
                pointer += 2;
            } else {
                return { memory, pointer, output }; // Pause execution until new input arrives
            }
        } else if (opcode === 4) {  // Output
            output = getParam(0);
            pointer += 2;
        } else if (opcode === 5) {  // Jump-if-true
            pointer = getParam(0) !== 0 ? getParam(1) : pointer + 3;
        } else if (opcode === 6) {  // Jump-if-false
            pointer = getParam(0) === 0 ? getParam(1) : pointer + 3;
        } else if (opcode === 7) {  // Less than
            setParam(2, getParam(0) < getParam(1) ? 1 : 0);
            pointer += 4;
        } else if (opcode === 8) {  // Equals
            setParam(2, getParam(0) === getParam(1) ? 1 : 0);
            pointer += 4;
        }
    }

    return { memory, pointer, output };
}

// Function to generate all possible phase settings permutations
function permute(arr) {
    if (arr.length === 1) return [arr];
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let rest = permute([...arr.slice(0, i), ...arr.slice(i + 1)]);
        result.push(...rest.map(r => [arr[i], ...r]));
    }
    return result;
}

// Function to find highest thruster signal (original amplifier setup)
function findHighestSignal(program) {
    const phaseSettings = permute([0, 1, 2, 3, 4]);
    let maxSignal = 0;

    for (const settings of phaseSettings) {
        let signal = 0;
        for (const phase of settings) {
            signal = runIntcode(program, [phase, signal]).output;
        }
        maxSignal = Math.max(maxSignal, signal);
    }

    return maxSignal;
}

// Function to find highest thruster signal using feedback loop
function findHighestSignalFeedbackLoop(program) {
    const phaseSettings = permute([5, 6, 7, 8, 9]);
    let maxSignal = 0;

    for (const settings of phaseSettings) {
        let amplifiers = settings.map(() => [...program]); // Independent memories
        let pointers = Array(settings.length).fill(0);
        let inputs = settings.map((phase, i) => [phase]); // Initialize phase inputs
        inputs[0].push(0); // First amp gets initial input

        let output = 0;
        let halted = false;

        while (!halted) {
            for (let i = 0; i < amplifiers.length; i++) {
                let result = runIntcode(amplifiers[i], inputs[i]);
                amplifiers[i] = result.memory;
                pointers[i] = result.pointer;

                if (result.output !== null) {
                    output = result.output;
                    inputs[(i + 1) % amplifiers.length].push(output); // Pass output to next amplifier
                } else {
                    halted = true; // Stop when an amplifier halts
                    break;
                }
            }
        }

        maxSignal = Math.max(maxSignal, output);
    }

    return maxSignal;
}

// Main execution
function main() {
    const filePath = 'inputDay07.txt'; // Change to actual file path
    const program = parseProgram(filePath);

    const highestSignal = findHighestSignal(program);
    console.log(`Highest signal to thrusters (original setup): ${highestSignal}`);

    const highestFeedbackSignal = findHighestSignalFeedbackLoop(program);
    console.log(`Highest signal to thrusters in feedback loop mode: ${highestFeedbackSignal}`);
}

main();
