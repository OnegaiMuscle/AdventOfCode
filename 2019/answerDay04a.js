function isValidPassword(password) {
  const str = password.toString();
  let hasDouble = false;

  for (let i = 1; i < str.length; i++) {
      if (str[i] < str[i - 1]) return false; // Digits must not decrease
      if (str[i] === str[i - 1]) hasDouble = true; // Check for adjacent duplicate
  }

  return hasDouble;
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
