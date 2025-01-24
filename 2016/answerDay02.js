const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function getBathroomCode(instructions) {
    const keypad = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    let x = 1, y = 1; // Start at '5'
    let code = '';

    instructions.forEach(line => {
        for (const move of line) {
            switch (move) {
                case 'U':
                    if (x > 0) x--;
                    break;
                case 'D':
                    if (x < 2) x++;
                    break;
                case 'L':
                    if (y > 0) y--;
                    break;
                case 'R':
                    if (y < 2) y++;
                    break;
            }
        }
        code += keypad[x][y];
    });

    return code;
}

const instructions = parseData('inputDay02.txt');
const bathroomCode = getBathroomCode(instructions);
console.log(`Bathroom code: ${bathroomCode}`);
