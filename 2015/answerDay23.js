let a = 0;
let b = 0;
let i = -1;
let inst = [];
const fs = require('fs');

fs.readFileSync('inputDay23.txt', 'utf-8').split('\n').forEach(instr => {
    inst.push(instr.replace(',', '').split(' '));
});

while (++i < inst.length) {
    switch (inst[i][0]) {
        case 'hlf':
            if (inst[i][1] === 'a') {
                a /= 2;
            } else {
                b /= 2;
            }
            break;
        case 'tpl':
            if (inst[i][1] === 'a') {
                a *= 3;
            } else {
                b *= 3;
            }
            break;
        case 'inc':
            if (inst[i][1] === 'a') {
                a += 1;
            } else {
                b += 1;
            }
            break;
        case 'jmp':
            i += parseInt(inst[i][1]) - 1;
            break;
        case 'jie':
            if ((inst[i][1] === 'a' ? a : b) % 2 === 0) {
                i += parseInt(inst[i][2]) - 1;
            }
            break;
        case 'jio':
            if ((inst[i][1] === 'a' ? a : b) === 1) {
                i += parseInt(inst[i][2]) - 1;
            }
            break;
    }
}

console.log(b);
