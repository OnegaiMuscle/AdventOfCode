const fs = require('fs');

// Function to fully react a polymer
function fullyReactPolymer(polymer) {
    const stack = [];
    for (const unit of polymer) {
        const lastUnit = stack[stack.length - 1];
        if (lastUnit && lastUnit !== unit && lastUnit.toLowerCase() === unit.toLowerCase()) {
            stack.pop(); // Units react
        } else {
            stack.push(unit); // Units do not react, add to stack
        }
    }
    return stack.length; // Remaining units after all reactions
}

// Function to parse polymer from a text file
function parsePolymerFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8').trim();
}

// Function to find the shortest polymer after removing all instances of one problematic unit type
function findShortestPolymerAfterImprovement(polymer) {
    const unitTypes = new Set(polymer.toLowerCase()); // Unique unit types (case-insensitive)
    let shortestLength = polymer.length;

    for (const unitType of unitTypes) {
        const improvedPolymer = polymer.replace(new RegExp(unitType, 'gi'), ''); // Remove all instances of the unit type
        const reactedLength = fullyReactPolymer(improvedPolymer);
        if (reactedLength < shortestLength) {
            shortestLength = reactedLength;
        }
    }

    return shortestLength;
}

// Example usage
const polymer = parsePolymerFromFile('inputDay05.txt'); // Replace 'polymer.txt' with your file path
const remainingUnits = fullyReactPolymer(polymer);
const shortestImprovedPolymerLength = findShortestPolymerAfterImprovement(polymer);

console.log(`Remaining units after full reaction: ${remainingUnits}`);
console.log(`Length of the shortest polymer after improvement: ${shortestImprovedPolymerLength}`);
