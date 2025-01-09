function isNice(string) {
  let hasPair = false;
  for (let i = 0; i < string.length - 1; i++) {
      const pair = string.slice(i, i + 2);
      if (string.slice(i + 2).includes(pair)) {
          hasPair = true;
          break;
      }
  }
  if (!hasPair) {
      return false;
  }

  let hasRepeatWithOneBetween = false;
  for (let i = 0; i < string.length - 2; i++) {
      if (string[i] === string[i + 2]) {
          hasRepeatWithOneBetween = true;
          break;
      }
  }
  if (!hasRepeatWithOneBetween) {
      return false;
  }

  return true;
}

function countNiceStrings(strings) {
  let niceCount = 0;
  for (let string of strings) {
      if (isNice(string)) {
          niceCount++;
      }
  }
  return niceCount;
}

const fs = require('fs');
const data = fs.readFileSync('inputDay05.txt', 'utf8').trim().split('\n');

const niceCount = countNiceStrings(data);
console.log(`Number of nice strings: ${niceCount}`);
