const fs = require('fs');

function runIntcodeProgram(intcode) {
    let memory = [...intcode];

    // Restore "1202 program alarm" state
    memory[1] = 12;
    memory[2] = 2;

    let pointer = 0;
    while (memory[pointer] !== 99) {
        const [opcode, input1, input2, output] = memory.slice(pointer, pointer + 4);

        if (opcode === 1) {
            memory[output] = memory[input1] + memory[input2];
        } else if (opcode === 2) {
            memory[output] = memory[input1] * memory[input2];
        } else {
            throw new Error(`Unknown opcode ${opcode} encountered`);
        }

        pointer += 4;
    }

    return memory[0];
}

function getIntcodeFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.trim().split(',').map(Number);
}

// Example usage
const intcode = getIntcodeFromFile('inputDay02.txt');
const result = runIntcodeProgram(intcode);
console.log('Value at position 0 after execution:', result);
