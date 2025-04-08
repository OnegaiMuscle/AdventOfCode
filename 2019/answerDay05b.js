const fs = require('fs');

function readInputFile(filename) {
    return fs.readFileSync(filename, 'utf8').trim().split(',').map(Number);
}

function runIntcodeProgram(memory, inputValue) {
    let pointer = 0;

    function getValue(mode, param) {
        return mode === 0 ? memory[param] : param;
    }

    while (memory[pointer] !== 99) {
        const instruction = memory[pointer].toString().padStart(5, '0');
        const opcode = Number(instruction.slice(3));
        const mode1 = Number(instruction[2]);
        const mode2 = Number(instruction[1]);

        switch (opcode) {
            case 1: { // Addition
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) + getValue(mode2, memory[pointer + 2]);
                pointer += 4;
                break;
            }
            case 2: { // Multiplication
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) * getValue(mode2, memory[pointer + 2]);
                pointer += 4;
                break;
            }
            case 3: { // Input
                memory[memory[pointer + 1]] = inputValue;
                pointer += 2;
                break;
            }
            case 4: { // Output
                console.log("Diagnostic Output:", getValue(mode1, memory[pointer + 1]));
                pointer += 2;
                break;
            }
            case 5: { // Jump-if-true
                if (getValue(mode1, memory[pointer + 1]) !== 0) {
                    pointer = getValue(mode2, memory[pointer + 2]);
                } else {
                    pointer += 3;
                }
                break;
            }
            case 6: { // Jump-if-false
                if (getValue(mode1, memory[pointer + 1]) === 0) {
                    pointer = getValue(mode2, memory[pointer + 2]);
                } else {
                    pointer += 3;
                }
                break;
            }
            case 7: { // Less than
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) < getValue(mode2, memory[pointer + 2]) ? 1 : 0;
                pointer += 4;
                break;
            }
            case 8: { // Equals
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) === getValue(mode2, memory[pointer + 2]) ? 1 : 0;
                pointer += 4;
                break;
            }
            default:
                throw new Error(`Unknown opcode: ${opcode}`);
        }
    }
}

// Run the updated Intcode program with input value 5 (thermal radiator controller)
const programData = readInputFile('inputDay05.txt');
runIntcodeProgram(programData, 5);
