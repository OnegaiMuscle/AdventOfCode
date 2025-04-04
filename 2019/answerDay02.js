const fs = require('fs');

// Intcode Computer Functions
function runIntcodeProgram(intcode, noun = 12, verb = 2) {
    let memory = [...intcode];

    // Set noun and verb
    memory[1] = noun;
    memory[2] = verb;

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

// Find noun-verb combination for output 19690720
function findNounVerb(filename, targetOutput) {
    const originalIntcode = getIntcodeFromFile(filename);

    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            if (runIntcodeProgram(originalIntcode, noun, verb) === targetOutput) {
                return 100 * noun + verb;
            }
        }
    }
    return null;
}



const intcode = getIntcodeFromFile('inputDay02.txt');
const result = runIntcodeProgram(intcode);
console.log('Value at position 0 after execution:', result);

const nounVerbResult = findNounVerb('inputDay02.txt', 19690720);
console.log('100 * noun + verb:', nounVerbResult);
