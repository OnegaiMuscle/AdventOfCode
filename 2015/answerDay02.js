console.time('Execution Time');

const fs = require('fs');
const data = fs.readFileSync('inputDay02.txt', 'utf8');
const lines = data.trim().split('\n');

function calculateWrappingPaper(l, w, h) {
    const side1 = l * w;
    const side2 = w * h;
    const side3 = h * l;
    const smallestSide = Math.min(side1, side2, side3);
    return 2 * (side1 + side2 + side3) + smallestSide;
};
function totalWrappingPaper(input) {
  return input.reduce((total, line) => {
    const [l, w, h] = line.split('x'); //implicit JS coercition
    return total + calculateWrappingPaper(l, w, h);
  }, 0);
};

console.log('answer01:', totalWrappingPaper(lines));

function calculateRibbon(l, w, h) {
  const perimeters = [2 * (l + w), 2 * (w + h), 2 * (h + l)];
  const smallestPerimeter = Math.min(...perimeters);
  const volume = l * w * h;
  return smallestPerimeter + volume;
};
function totalRibbon(input) {
  return input.reduce((total, line) => {
    const [l, w, h] = line.split('x').map(Number);
    return total + calculateRibbon(l, w, h);
  }, 0);
};

console.log('answer02:', totalRibbon(lines));

console.timeEnd('Execution Time');
