function isValidPassword(password) {
  const str = password.toString();
  let hasExactDouble = false;

  for (let i = 1; i < str.length; i++) {
      if (str[i] < str[i - 1]) return false; // Rule: Digits must not decrease
  }

  // Check for exactly two adjacent matching digits
  for (let i = 0; i < str.length - 1; i++) {
      if (str[i] === str[i + 1] &&
          (i === 0 || str[i] !== str[i - 1]) &&
          (i + 2 >= str.length || str[i] !== str[i + 2])) {
          hasExactDouble = true;
      }
  }

  return hasExactDouble;
}

function countValidPasswords(start, end) {
  let count = 0;
  for (let password = start; password <= end; password++) {
      if (isValidPassword(password)) count++;
  }
  return count;
}

// Run the function with the given range
const validPasswords = countValidPasswords(234208, 765869);
console.log("Total valid passwords:", validPasswords);
