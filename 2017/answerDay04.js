const fs = require('fs');

function countValidPassphrases(filePath) {
  const passphrases = fs.readFileSync(filePath, 'utf-8')
    .split('\n') // Split into lines
    .map(line => line.trim()) // Remove leading/trailing spaces
    .filter(line => line.length > 0); // Remove empty lines

  const validCount = passphrases
    .map(passphrase => passphrase.split(' ')) // Split passphrase into words
    .filter(words => new Set(words).size === words.length) // Check for duplicates
    .length; // Count valid ones

  return validCount;
}



const filePath = 'inputDay04.txt';
const validPassphrases = countValidPassphrases(filePath);

console.log("Number of Valid Passphrases:", validPassphrases);
