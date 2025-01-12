// Function to check if the password contains an increasing straight of at least three letters
function hasIncreasingStraight(password) {
  for (let i = 0; i < password.length - 2; i++) {
      if (password.charCodeAt(i) + 1 === password.charCodeAt(i + 1) &&
          password.charCodeAt(i) + 2 === password.charCodeAt(i + 2)) {
          return true;
      }
  }
  return false;
}

// Function to check if the password contains forbidden letters
function containsForbiddenLetters(password) {
  return /[iol]/.test(password);
}

// Function to check if the password contains at least two different, non-overlapping pairs of letters
function hasTwoPairs(password) {
  const pairs = password.match(/([a-z])\1/g);
  return pairs && pairs.length >= 2;
}

// Function to increment the password
function incrementPassword(password) {
  let newPassword = '';
  let carry = true;

  for (let i = password.length - 1; i >= 0; i--) {
      if (carry) {
          if (password[i] === 'z') {
              newPassword = 'a' + newPassword;
          } else {
              newPassword = String.fromCharCode(password.charCodeAt(i) + 1) + newPassword;
              carry = false;
          }
      } else {
          newPassword = password[i] + newPassword;
      }
  }

  return newPassword;
}

// Function to find the next valid password
function findNextPassword(password) {
  let newPassword = incrementPassword(password);

  while (!hasIncreasingStraight(newPassword) || containsForbiddenLetters(newPassword) || !hasTwoPairs(newPassword)) {
      newPassword = incrementPassword(newPassword);
  }

  return newPassword;
}

// Example usage
const currentPassword = 'vzbxxyzz'; // Replace with the last valid password found
const nextPassword = findNextPassword(currentPassword);
console.log(`The next valid password is: ${nextPassword}`);
