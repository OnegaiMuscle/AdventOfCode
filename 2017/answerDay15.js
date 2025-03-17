const fs = require('fs');

// Function to parse starting values from a text file
function parseInput(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.trim().split('\n');
    const generatorAStart = parseInt(lines[0].match(/\d+/)[0], 10);
    const generatorBStart = parseInt(lines[1].match(/\d+/)[0], 10);
    return { generatorAStart, generatorBStart };
}

// Function to generate the next value for a generator
function nextValue(previousValue, factor, multiple = 1) {
    const divisor = 2147483647;
    let value = (previousValue * factor) % divisor;
    while (value % multiple !== 0) {
        value = (value * factor) % divisor;
    }
    return value;
}

// Function to count matches for the lowest 16 bits
function countMatches(generatorAStart, generatorBStart, pairs, picky = false) {
    const factorA = 16807;
    const factorB = 48271;
    let matches = 0;
    let valueA = generatorAStart;
    let valueB = generatorBStart;

    for (let i = 0; i < pairs; i++) {
        if (picky) {
            // Use picky criteria (multiples of 4 for A, multiples of 8 for B)
            valueA = nextValue(valueA, factorA, 4);
            valueB = nextValue(valueB, factorB, 8);
        } else {
            // Standard generation
            valueA = nextValue(valueA, factorA);
            valueB = nextValue(valueB, factorB);
        }

        // Compare the lowest 16 bits
        if ((valueA & 0xFFFF) === (valueB & 0xFFFF)) {
            matches++;
        }
    }

    return matches;
}

// Main function to handle both scenarios
function main() {
    const filename = 'inputDay15.txt'; // Replace with your input file name
    const { generatorAStart, generatorBStart } = parseInput(filename);

    // Scenario 1: 40 million pairs without picky rules
    const pairs1 = 40000000;
    const matches1 = countMatches(generatorAStart, generatorBStart, pairs1);
    console.log(`The judge's final count without picky rules is: ${matches1}`);

    // Scenario 2: 5 million pairs with picky rules
    const pairs2 = 5000000;
    const matches2 = countMatches(generatorAStart, generatorBStart, pairs2, true);
    console.log(`The judge's final count with picky rules is: ${matches2}`);
}

// Execute the main function
main();
