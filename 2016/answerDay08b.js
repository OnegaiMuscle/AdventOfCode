const fs = require('fs');

const input = fs.readFileSync('inputDay08.txt', 'utf-8');
const screen = [];
for (let i = 0; i < 6; i++) {
  screen[i] = [];
  for (let j = 0; j < 50; j++) {
    screen[i][j] = '.';
  }
}

function rect(width, height) {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      screen[h][w] = '#';
    }
  }
}

function rotateRow(y, by) {
  while (by--) {
    const right = screen[y][screen[0].length - 1];
    for (let x = screen[0].length - 1; x >= 0; x--) {
      screen[y][x] = x > 0 ? screen[y][x - 1] : right;
    }
  }
}

function rotateCol(x, by) {
  while (by--) {
    const bottom = screen[screen.length - 1][x];
    for (let y = screen.length - 1; y >= 0; y--) {
      screen[y][x] = y > 0 ? screen[y - 1][x] : bottom;
    }
  }
}

function parseInstruction(str) {
  const a = str.split(' ');
  if (a[0] === 'rect') {
    const size = a[1].split('x').map(i => parseInt(i, 10));
    return rect(size[0], size[1]);
  }

  const line = parseInt(a[2].substring(2), 10);
  const by = parseInt(a[4], 10);

  return a[1] === 'row' ? rotateRow(line, by) : rotateCol(line, by);
}

function display(screen) {
  return screen.map(row => row.join('')).join('\n');
}

input.split('\n').filter(s => s).forEach(line => parseInstruction(line));

console.log('Part 1', display(screen).split('').filter(c => c === '#').length);
console.log('Part 2', '\n' + display(screen));
