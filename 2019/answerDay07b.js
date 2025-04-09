const fs = require('fs');

// Function to parse Intcode program from a text file
function parseProgram(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split(',').map(Number);
}

// Function to execute Intcode program step-by-step, allowing pausing & resuming
function createAmplifier(program, phase) {
    let memory = [...program];
    let pointer = 0;
    let inputs = [phase];
    let halted = false;

    return (inputSignal) => {
        if (halted) return null;
        inputs.push(inputSignal);

        while (memory[pointer] !== 99) {
            const opcode = memory[pointer] % 100;
            const modes = Math.floor(memory[pointer] / 100).toString().padStart(3, '0').split('').reverse().map(Number);

            const getParam = (index) => modes[index] ? memory[pointer + index + 1] : memory[memory[pointer + index + 1]];
            const setParam = (index, value) => memory[memory[pointer + index + 1]] = value;

            if (opcode === 1) { // Addition
                setParam(2, getParam(0) + getParam(1));
                pointer += 4;
            } else if (opcode === 2) { // Multiplication
                setParam(2, getParam(0) * getParam(1));
                pointer += 4;
            } else if (opcode === 3) { // Input
                if (inputs.length === 0) return null; // Pause execution if input not available
                setParam(0, inputs.shift());
                pointer += 2;
            } else if (opcode === 4) { // Output
                const output = getParam(0);
                pointer += 2;
                return output; // Return output immediately (pause execution)
            } else if (opcode === 5) { // Jump-if-true
                pointer = getParam(0) !== 0 ? getParam(1) : pointer + 3;
            } else if (opcode === 6) { // Jump-if-false
                pointer = getParam(0) === 0 ? getParam(1) : pointer + 3;
            } else if (opcode === 7) { // Less than
                setParam(2, getParam(0) < getParam(1) ? 1 : 0);
                pointer += 4;
            } else if (opcode === 8) { // Equals
                setParam(2, getParam(0) === getParam(1) ? 1 : 0);
                pointer += 4;
            }
        }

        halted = true;
        return null;
    };
}

// Function to find the highest thruster signal in feedback loop mode
function findHighestSignalFeedbackLoop(program) {
    const phaseSettings = permute([5, 6, 7, 8, 9]);
    let maxSignal = 0;

    for (const settings of phaseSettings) {
        const amplifiers = settings.map(phase => createAmplifier(program, phase));

        let signal = 0;
        let halted = false;

        while (!halted) {
            for (let i = 0; i < amplifiers.length; i++) {
                const result = amplifiers[i](signal);
                if (result === null) {
                    halted = true;
                    break;
                }
                signal = result;
            }
        }

        maxSignal = Math.max(maxSignal, signal);
    }

    return maxSignal;
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

// Main execution
function main() {
    const filePath = 'inputDay07.txt'; // Change to actual file path
    const program = parseProgram(filePath);

    const highestFeedbackSignal = findHighestSignalFeedbackLoop(program);
    console.log(`Highest signal to thrusters in feedback loop mode (optimized): ${highestFeedbackSignal}`);
}

main();
