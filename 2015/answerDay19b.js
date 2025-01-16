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

function reverseReplacements(replacements) {
    return replacements.map(({ from, to }) => ({ from: to, to: from }));
}

function findFewestSteps(replacements, targetMolecule) {
    const reversedReplacements = reverseReplacements(replacements);
    const memo = new Map();

    function dfs(molecule) {
        if (molecule === 'e') return 0;
        if (memo.has(molecule)) return memo.get(molecule);

        let minSteps = Infinity;
        for (const { from, to } of reversedReplacements) {
            const index = molecule.indexOf(from);
            if (index !== -1) {
                const newMolecule = molecule.slice(0, index) + to + molecule.slice(index + from.length);
                const steps = dfs(newMolecule);
                if (steps !== Infinity) {
                    minSteps = Math.min(minSteps, steps + 1);
                }
            }
        }

        memo.set(molecule, minSteps);
        return minSteps;
    }

    return dfs(targetMolecule);
}

// Example usage:
const filePath = 'inputDay19.txt'; // Replace with the path to your input file
const { replacements, molecule } = parseInput(filePath);
const fewestSteps = findFewestSteps(replacements, molecule);
console.log('Fewest number of steps to make the medicine:', fewestSteps);
