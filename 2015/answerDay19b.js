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

function findFewestSteps(replacements, targetMolecule) {
    const queue = [{ molecule: 'e', steps: 0 }];
    const visited = new Set(['e']);

    while (queue.length > 0) {
        const { molecule, steps } = queue.shift();

        if (molecule === targetMolecule) {
            return steps;
        }

        const nextMolecules = generateMolecules(molecule, replacements);
        nextMolecules.forEach(nextMolecule => {
            if (!visited.has(nextMolecule)) {
                visited.add(nextMolecule);
                queue.push({ molecule: nextMolecule, steps: steps + 1 });
            }
        });
    }

    return -1; // If no solution is found
}

// Example usage:
const filePath = 'inputDay19.txt'; // Replace with the path to your input file
const { replacements, molecule } = parseInput(filePath);
const fewestSteps = findFewestSteps(replacements, molecule);
console.log('Fewest number of steps to make the medicine:', fewestSteps);
