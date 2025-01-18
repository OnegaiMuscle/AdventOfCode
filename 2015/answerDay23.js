const fs = require('fs');

function parseInstructions(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function runProgram(instructions) {
    let registers = { a: 0, b: 0 };
    let pointer = 0;

    while (pointer >= 0 && pointer < instructions.length) {
        let [instruction, arg1, arg2] = instructions[pointer].split(' ');

        switch (instruction) {
            case 'hlf':
                registers[arg1] = Math.floor(registers[arg1] / 2);
                pointer++;
                break;
            case 'tpl':
                registers[arg1] *= 3;
                pointer++;
                break;
            case 'inc':
                registers[arg1]++;
                pointer++;
                break;
            case 'jmp':
                pointer += parseInt(arg1);
                break;
            case 'jie':
                if (registers[arg1] % 2 === 0) {
                    pointer += parseInt(arg2);
                } else {
                    pointer++;
                }
                break;
            case 'jio':
                if (registers[arg1] === 1) {
                    pointer += parseInt(arg2);
                } else {
                    pointer++;
                }
                break;
            default:
                throw new Error(`Unknown instruction: ${instruction}`);
        }
    }

    return registers.b;
}

// Example usage:
const filePath = 'inputDay23.txt';
const instructions = parseInstructions(filePath);
const result = runProgram(instructions);
console.log(`The value in register b is: ${result}`);
