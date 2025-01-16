const fs = require('fs');

function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const replacements = [];
    let molecule = '';

    data.forEach(line => {
        if (line.includes('=>')) {
            const [from, to] = line.split(' => ');
            replacements.push({ from, to });
        } else if (line) {
            molecule = line;
        }
    });

    return { replacements, molecule };
}

function generateMolecules(molecule, replacements) {
    const molecules = new Set();

    replacements.forEach(({ from, to }) => {
        let index = molecule.indexOf(from);
        while (index !== -1) {
            const newMolecule = molecule.slice(0, index) + to + molecule.slice(index + from.length);
            molecules.add(newMolecule);
            index = molecule.indexOf(from, index + 1);
        }
    });

    return molecules;
}

// Example usage:
const filePath = 'inputDay19.txt'; // Replace with the path to your input file
const { replacements, molecule } = parseInput(filePath);
const molecules = generateMolecules(molecule, replacements);
console.log('Number of distinct molecules:', molecules.size);
