function isNice(string) {
  const vowels = "aeiou";
  const disallowed = ["ab", "cd", "pq", "xy"];

  let vowelCount = 0;
  for (let char of string) {
      if (vowels.includes(char)) {
          vowelCount++;
      }
  }
  if (vowelCount < 3) {
      return false;
  }

  let hasDouble = false;
  for (let i = 0; i < string.length - 1; i++) {
      if (string[i] === string[i + 1]) {
          hasDouble = true;
          break;
      }
  }
  if (!hasDouble) {
      return false;
  }

  for (let substring of disallowed) {
      if (string.includes(substring)) {
          return false;
      }
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



const niceCount = countNiceStrings(strings);
console.log(`Number of nice strings: ${niceCount}`);
