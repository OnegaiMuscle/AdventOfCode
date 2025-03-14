const fs = require('fs');

function countValidPassphrases(filePath) {
  const passphrases = fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const validCount = passphrases
    .map(passphrase => passphrase.split(' '))
    .filter(words => new Set(words).size === words.length)
    .length;

  return validCount;
}



const filePath = 'inputDay04.txt';
const validPassphrases = countValidPassphrases(filePath);

console.log("Number of Valid Passphrases:", validPassphrases);


// Function to sort the letters of a word alphabetically
function sortWord(word) {
  return word.split('').sort().join('');
}

function countValidPassphrasesbis(filePath) {
  const passphrases = fs.readFileSync(filePath, 'utf-8')
    .split('\n') 
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const validCount = passphrases
    .map(passphrase => passphrase.split(' ')
      .map(word => sortWord(word)))
    .filter(sortedWords => new Set(sortedWords).size === sortedWords.length)
    .length;

  return validCount;
}


const validPassphrasesbis = countValidPassphrasesbis(filePath);

console.log("Number of Valid Passphrases:", validPassphrasesbis);
