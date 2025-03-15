const fs = require('fs');

// Function to parse input from a text file
function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    const programs = new Map();

    data.forEach(line => {
        const [namePart, childrenPart] = line.split('->').map(part => part.trim());
        const [name, weight] = namePart.match(/^(\w+)\s\((\d+)\)$/).slice(1);
        const children = childrenPart ? childrenPart.split(',').map(child => child.trim()) : [];
        programs.set(name, { name, weight: parseInt(weight, 10), children });
    });

    return programs;
}

// Helper function to calculate the total weight of a program's tower
function calculateTowerWeight(program, programs, weights) {
    if (weights.has(program)) {
        return weights.get(program);
    }

    const node = programs.get(program);
    const totalWeight = node.weight + node.children.reduce((sum, child) => sum + calculateTowerWeight(child, programs, weights), 0);
    weights.set(program, totalWeight);

    return totalWeight;
}

// Function to find the unbalanced program and calculate the correct weight
function findUnbalancedProgram(program, programs, weights) {
    const node = programs.get(program);
    const childWeights = node.children.map(child => ({
        name: child,
        weight: calculateTowerWeight(child, programs, weights)
    }));

    // Check if the child weights are unbalanced
    const weightCounts = childWeights.reduce((counts, { weight }) => {
        counts[weight] = (counts[weight] || 0) + 1;
        return counts;
    }, {});

    const weightsArray = Object.keys(weightCounts).map(Number);

    if (weightsArray.length === 1) {
        // If all child weights are balanced, this node is not the culprit
        return null;
    }

    const correctWeight = weightsArray.find(w => weightCounts[w] > 1);
    const incorrectWeight = weightsArray.find(w => weightCounts[w] === 1);

    const unbalancedChild = childWeights.find(child => child.weight === incorrectWeight).name;
    const adjustment = correctWeight - incorrectWeight;

    // If the unbalanced child has unbalanced children, continue searching recursively
    const deeperUnbalance = findUnbalancedProgram(unbalancedChild, programs, weights);
    if (deeperUnbalance) {
        return deeperUnbalance;
    }

    return {
        program: unbalancedChild,
        correctWeight: programs.get(unbalancedChild).weight + adjustment
    };
}

// Main function
function main() {
    const filePath = 'inputDay07.txt'; // Replace with your input file path
    const programs = parseInput(filePath);
    const weights = new Map();

    // Find the root (bottom program) first
    const bottomProgram = findBottomProgram(programs);

    // Find the unbalanced program
    const unbalanced = findUnbalancedProgram(bottomProgram, programs, weights);

    if (unbalanced) {
        console.log(`The unbalanced program is: ${unbalanced.program}`);
        console.log(`Its correct weight should be: ${unbalanced.correctWeight}`);
    } else {
        console.log('The tower is already balanced.');
    }
}

// Function to find the bottom program (reuse from earlier solution)
function findBottomProgram(programs) {
    const allPrograms = new Set(programs.keys());
    const childPrograms = new Set();

    programs.forEach(program => {
        program.children.forEach(child => {
            childPrograms.add(child);
        });
    });

    for (const program of allPrograms) {
        if (!childPrograms.has(program)) {
            return program;
        }
    }

    return null; // Shouldn't happen if the input is correct
}

main();
