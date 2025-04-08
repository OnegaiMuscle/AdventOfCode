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
            case 1:
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) + getValue(mode2, memory[pointer + 2]);
                pointer += 4;
                break;
            case 2:
                memory[memory[pointer + 3]] = getValue(mode1, memory[pointer + 1]) * getValue(mode2, memory[pointer + 2]);
                pointer += 4;
                break;
            case 3:
                memory[memory[pointer + 1]] = inputValue;
                pointer += 2;
                break;
            case 4:
                console.log("Diagnostic Output:", getValue(mode1, memory[pointer + 1]));
                pointer += 2;
                break;
            default:
                throw new Error(`Unknown opcode: ${opcode}`);
        }
    }
}

// Execute program
const programData = readInputFile('inputDay05.txt');
runIntcodeProgram(programData, 1);
