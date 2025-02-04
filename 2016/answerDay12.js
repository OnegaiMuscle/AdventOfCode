const fs = require('fs');

function parseFile(filename) {
    return fs.readFileSync(filename, 'utf8').trim().split('\n');
}

function executeInstructions(instructions) {
    const registers = { a: 0, b: 0, c: 0, d: 0 };
    let index = 0;

    while (index < instructions.length) {
        const parts = instructions[index].split(' ');
        const command = parts[0];
        const x = parts[1];
        const y = parts[2];

        switch (command) {
            case 'cpy':
                if (isNaN(x)) {
                    registers[y] = registers[x];
                } else {
                    registers[y] = parseInt(x, 10);
                }
                break;
            case 'inc':
                registers[x]++;
                break;
            case 'dec':
                registers[x]--;
                break;
            case 'jnz':
                const value = isNaN(x) ? registers[x] : parseInt(x, 10);
                if (value !== 0) {
                    index += parseInt(y, 10) - 1;
                }
                break;
        }

        index++;
    }

    return registers.a;
}

const filename = 'inputDay12.txt';
const instructions = parseFile(filename);
const result = executeInstructions(instructions);
console.log(`Value in register a: ${result}`);

function executeInstructionsbis(instructions, initialC = 0) {
    const registers = { a: 0, b: 0, c: initialC, d: 0 };
    let index = 0;

    while (index < instructions.length) {
        const parts = instructions[index].split(' ');
        const command = parts[0];
        const x = parts[1];
        const y = parts[2];

        switch (command) {
            case 'cpy':
                if (isNaN(x)) {
                    registers[y] = registers[x];
                } else {
                    registers[y] = parseInt(x, 10);
                }
                break;
            case 'inc':
                registers[x]++;
                break;
            case 'dec':
                registers[x]--;
                break;
            case 'jnz':
                const value = isNaN(x) ? registers[x] : parseInt(x, 10);
                if (value !== 0) {
                    index += parseInt(y, 10) - 1;
                }
                break;
        }

        index++;
    }

    return registers.a;
}


const resultbis = executeInstructionsbis(instructions, 1); // Initialize register c to 1
console.log(`Value in register a: ${resultbis}`);
