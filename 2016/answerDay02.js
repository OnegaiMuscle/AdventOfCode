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

function getBathroomCodebis(instructions) {
    const keypad = [
        [null, null, '1', null, null],
        [null, '2', '3', '4', null],
        ['5', '6', '7', '8', '9'],
        [null, 'A', 'B', 'C', null],
        [null, null, 'D', null, null]
    ];
    let x = 2, y = 0; // Start at '5'
    let code = '';

    instructions.forEach(line => {
        for (const move of line) {
            let newX = x, newY = y;
            switch (move) {
                case 'U':
                    newX = x > 0 ? x - 1 : x;
                    break;
                case 'D':
                    newX = x < 4 ? x + 1 : x;
                    break;
                case 'L':
                    newY = y > 0 ? y - 1 : y;
                    break;
                case 'R':
                    newY = y < 4 ? y + 1 : y;
                    break;
            }
            if (keypad[newX][newY] !== null) {
                x = newX;
                y = newY;
            }
        }
        code += keypad[x][y];
    });

    return code;
}

const instructions = parseData('inputDay02.txt');
const bathroomCode = getBathroomCode(instructions);
console.log(`Bathroom code: ${bathroomCode}`);
const bathroomCodebis = getBathroomCodebis(instructions);
console.log(`Bathroom code: ${bathroomCodebis}`);
