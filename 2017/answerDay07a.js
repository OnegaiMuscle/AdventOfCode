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

// Function to find the bottom program
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

// Main function
function main() {
    const filePath = 'inputDay07.txt'; // Replace with your input file path
    const programs = parseInput(filePath);
    const bottomProgram = findBottomProgram(programs);
    console.log(`The bottom program is: ${bottomProgram}`);
}

main();
