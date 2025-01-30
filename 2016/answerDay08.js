const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function createScreen(width, height) {
    const screen = [];
    for (let i = 0; i < height; i++) {
        screen.push(Array(width).fill(false));
    }
    return screen;
}

function applyInstruction(screen, instruction) {
    const rectMatch = instruction.match(/rect (\d+)x(\d+)/);
    const rotateRowMatch = instruction.match(/rotate row y=(\d+) by (\d+)/);
    const rotateColumnMatch = instruction.match(/rotate column x=(\d+) by (\d+)/);

    if (rectMatch) {
        const [_, width, height] = rectMatch.map(Number);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                screen[y][x] = true;
            }
        }
    } else if (rotateRowMatch) {
        const [_, row, shift] = rotateRowMatch.map(Number);
        const newRow = Array(screen[0].length);
        for (let x = 0; x < screen[0].length; x++) {
            newRow[(x + shift) % screen[0].length] = screen[row][x];
        }
        screen[row] = newRow;
    } else if (rotateColumnMatch) {
        const [_, col, shift] = rotateColumnMatch.map(Number);
        const newCol = Array(screen.length);
        for (let y = 0; y < screen.length; y++) {
            newCol[(y + shift) % screen.length] = screen[y][col];
        }
        for (let y = 0; y < screen.length; y++) {
            screen[y][col] = newCol[y];
        }
    }
}

function countLitPixels(screen) {
    return screen.flat().filter(pixel => pixel).length;
}

const instructions = parseData('inputDay08.txt');
const screen = createScreen(50, 6);

instructions.forEach(instruction => applyInstruction(screen, instruction));

const litPixels = countLitPixels(screen);
console.log(`Number of lit pixels: ${litPixels}`);




function applyInstructionbis(screen, instruction) {
    const rectMatch = instruction.match(/rect (\d+)x(\d+)/);
    const rotateRowMatch = instruction.match(/rotate row y=(\d+) by (\d+)/);
    const rotateColumnMatch = instruction.match(/rotate column x=(\d+) by (\d+)/);

    if (rectMatch) {
        const [_, width, height] = rectMatch.map(Number);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                screen[y][x] = true;
            }
        }
    } else if (rotateRowMatch) {
        const [_, row, shift] = rotateRowMatch.map(Number);
        const newRow = Array(screen[0].length);
        for (let x = 0; x < screen[0].length; x++) {
            newRow[(x + shift) % screen[0].length] = screen[row][x];
        }
        screen[row] = newRow;
    } else if (rotateColumnMatch) {
        const [_, col, shift] = rotateColumnMatch.map(Number);
        const newCol = Array(screen.length);
        for (let y = 0; y < screen.length; y++) {
            newCol[(y + shift) % screen.length] = screen[y][col];
        }
        for (let y = 0; y < screen.length; y++) {
            screen[y][col] = newCol[y];
        }
    }
}

function displayScreenbis(screen) {
    return screen.map(row => row.map(pixel => (pixel ? '#' : '.')).join('')).join('\n');
}




instructions.forEach(instruction => applyInstructionbis(screen, instruction));

console.log(displayScreenbis(screen));
