const fs = require('fs');

function countValidPassphrases(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  const passphrases = data.split('\n').map(line => line.trim());

  const validCount = passphrases
    .map(passphrase => passphrase.split(' '))
    .filter(words => new Set(words).size === words.length).length;

  return validCount;
}

// Example usage:
const filePath = 'inputDay04.txt'; 
const validPassphrases = countValidPassphrases(filePath);

console.log("Number of Valid Passphrases:", validPassphrases);
