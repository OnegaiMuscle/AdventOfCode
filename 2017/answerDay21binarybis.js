const fs = require('fs');

// Convertit une grille en bitboard
function gridToBitboard(grid) {
    let bitboard = 0, size = grid.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === '#') {
                bitboard |= (1 << (i * size + j));
            }
        }
    }
    return bitboard;
}

// Convertit un bitboard en grille
function bitboardToGrid(bitboard, size) {
    return Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) =>
            (bitboard & (1 << (i * size + j))) ? '#' : '.'
        ).join('')
    );
}

// Rotation 90° d'un bitboard
function rotate90(bitboard, size) {
    let newBoard = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (bitboard & (1 << (i * size + j))) {
                newBoard |= (1 << (j * size + (size - 1 - i)));
            }
        }
    }
    return newBoard;
}

// Génère toutes les transformations possibles (rotations + flips)
function generateTransformations(bitboard, size) {
    let transformations = new Set();
    let current = bitboard;
    for (let i = 0; i < 4; i++) {
        transformations.add(current);
        transformations.add(flipHorizontal(current, size));
        transformations.add(flipVertical(current, size));
        current = rotate90(current, size);
    }
    return transformations;
}

// Flip horizontal
function flipHorizontal(bitboard, size) {
    let newBoard = 0;
    for (let i = 0; i < size; i++) {
        let row = (bitboard >> (i * size)) & ((1 << size) - 1);
        let flippedRow = reverseBits(row, size);
        newBoard |= flippedRow << (i * size);
    }
    return newBoard;
}

// Flip vertical
function flipVertical(bitboard, size) {
    let newBoard = 0;
    for (let i = 0; i < size; i++) {
        let row = (bitboard >> (i * size)) & ((1 << size) - 1);
        newBoard |= row << ((size - 1 - i) * size);
    }
    return newBoard;
}

// Reverse bits d'une ligne
function reverseBits(n, size) {
    let rev = 0;
    for (let i = 0; i < size; i++) {
        rev |= ((n >> i) & 1) << (size - 1 - i);
    }
    return rev;
}

// Parse les règles depuis un fichier
function parseRules(filename) {
    let rules = new Map();
    let data = fs.readFileSync(filename, 'utf8').trim().split('\n');

    for (let line of data) {
        let [input, output] = line.split(' => ');
        let inputGrid = input.split('/');
        let outputGrid = output.split('/');

        let inputSize = inputGrid.length;
        let outputBitboard = gridToBitboard(outputGrid);

        let inputBitboard = gridToBitboard(inputGrid);
        for (let variant of generateTransformations(inputBitboard, inputSize)) {
            rules.set(variant, outputBitboard);
        }
    }
    return rules;
}

// Transforme la grille en utilisant les règles
function enhanceGrid(grid, rules) {
    let size = grid.length;
    let blockSize = size % 2 === 0 ? 2 : 3;
    let newBlockSize = blockSize + 1;
    let newSize = (size / blockSize) * newBlockSize;

    let newGrid = Array(newSize).fill().map(() => Array(newSize).fill('.'));
    let bitboards = [];

    for (let i = 0; i < size; i += blockSize) {
        for (let j = 0; j < size; j += blockSize) {
            let subGrid = grid.slice(i, i + blockSize).map(row => row.slice(j, j + blockSize));
            let subBitboard = gridToBitboard(subGrid);
            let enhancedBitboard = rules.get(subBitboard);
            bitboards.push({ bitboard: enhancedBitboard, x: i / blockSize, y: j / blockSize });
        }
    }

    // Reconstruction
    for (let { bitboard, x, y } of bitboards) {
        let enhancedGrid = bitboardToGrid(bitboard, newBlockSize);
        for (let i = 0; i < newBlockSize; i++) {
            for (let j = 0; j < newBlockSize; j++) {
                newGrid[x * newBlockSize + i][y * newBlockSize + j] = enhancedGrid[i][j];
            }
        }
    }

    return newGrid;
}

// Exécute l'algorithme pour `n` itérations
function countPixelsOn(filename, iterations) {
    let rules = parseRules(filename);
    let grid = ['.#.', '..#', '###'].map(row => row.split(''));

    for (let i = 0; i < iterations; i++) {
        grid = enhanceGrid(grid, rules);
    }

    return grid.flat().filter(c => c === '#').length;
}

// Exécuter
const filename = 'inputDay21.txt';
console.log("Pixels ON after 5 iterations:", countPixelsOn(filename, 5));
console.log("Pixels ON after 18 iterations:", countPixelsOn(filename, 18));
