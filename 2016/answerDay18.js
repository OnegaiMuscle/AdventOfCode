const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'inputDay18.txt');

// Fonction pour analyser les données à partir d'un fichier texte
function parseDataFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8').trim();
}

// Fonction pour déterminer le type de tuile dans la prochaine ligne
function getNextRow(previousRow) {
    let newRow = '';
    for (let i = 0; i < previousRow.length; i++) {
        const left = i > 0 ? previousRow[i - 1] : '.';
        const center = previousRow[i];
        const right = i < previousRow.length - 1 ? previousRow[i + 1] : '.';

        if ((left === '^' && center === '^' && right === '.') ||
            (left === '.' && center === '^' && right === '^') ||
            (left === '^' && center === '.' && right === '.') ||
            (left === '.' && center === '.' && right === '^')) {
            newRow += '^';
        } else {
            newRow += '.';
        }
    }
    return newRow;
}

// Fonction pour calculer le nombre de tuiles sûres sur un nombre donné de lignes
function countSafeTiles(firstRow, totalRows) {
    let currentRow = firstRow;
    let safeTileCount = currentRow.split('').filter(tile => tile === '.').length;

    for (let i = 1; i < totalRows; i++) {
        const nextRow = getNextRow(currentRow);
        safeTileCount += nextRow.split('').filter(tile => tile === '.').length;
        currentRow = nextRow;
    }

    return safeTileCount;
}

// Entrée du puzzle
const firstRow = parseDataFromFile(filePath);
const totalRows = 40; // Nombre total de lignes, y compris la première ligne

const safeTileCount = countSafeTiles(firstRow, totalRows);
console.log(`Le nombre de tuiles sûres est : ${safeTileCount}`);

const totalRowsbis = 400000; // Nombre total de lignes, y compris la première ligne

const safeTileCountbis = countSafeTiles(firstRow, totalRowsbis);
console.log(`Le nombre de tuiles sûres est : ${safeTileCountbis}`);
