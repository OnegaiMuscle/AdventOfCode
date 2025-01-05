console.time('Execution Time');

const fs = require('fs');
const data = fs.readFileSync('inputDay03.txt', 'utf8').trim();

const directions = {
  '^': (x,y) => [x, y + 1],
  'v': (x,y) => [x ,y - 1],
  '<': (x,y) => [x - 1, y],
  '>': (x,y) => [x + 1, y],
};
const visitedHouses = [...data].reduce(([house, x, y], value) => {
  [x, y] = directions[value](x, y);
  const key = `${x},${y}`;
  house[key] = (house[key] || 0) + 1;
  return [house, x, y];
}, [{ '0:0': 1}, 0, 0]);

console.log('answer01:', Object.keys(visitedHouses[0]).length);

const nextVisitedHouses = [...data].reduce(([house, santaPos, roboPos], value, index) => {
  const isSantaTurn = index % 2 === 0;
  [x, y] = isSantaTurn ? santaPos : roboPos;
  [x, y] = directions[value](x, y);
  isSantaTurn ? santaPos = [x, y] : roboPos = [x, y];
  const key = `${x},${y}`;
  house[key] = (house[key] || 0) + 1;
  return [house, santaPos, roboPos];
}, [{ '0,0': 2 }, [0, 0], [0, 0]]);

console.log('answer02:', Object.keys(nextVisitedHouses[0]).length);

console.timeEnd('Execution Time');
