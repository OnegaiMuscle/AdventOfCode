const fs = require('fs');

// Function to parse dance moves from a text file
function parseMoves(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.trim().split(',');
}

// Function to perform the spin move
function spin(programs, size) {
    const n = programs.length;
    return programs.slice(n - size).concat(programs.slice(0, n - size));
}

// Function to perform the exchange move
function exchange(programs, posA, posB) {
    const temp = programs[posA];
    programs[posA] = programs[posB];
    programs[posB] = temp;
    return programs;
}

// Function to perform the partner move
function partner(programs, progA, progB) {
    const posA = programs.indexOf(progA);
    const posB = programs.indexOf(progB);
    return exchange(programs, posA, posB);
}

// Function to simulate the dance
function dance(moves, programs) {
    moves.forEach(move => {
        if (move[0] === 's') {
            // Spin move
            const size = parseInt(move.slice(1), 10);
            programs = spin(programs, size);
        } else if (move[0] === 'x') {
            // Exchange move
            const [posA, posB] = move.slice(1).split('/').map(Number);
            programs = exchange(programs, posA, posB);
        } else if (move[0] === 'p') {
            // Partner move
            const [progA, progB] = move.slice(1).split('/');
            programs = partner(programs, progA, progB);
        }
    });

    return programs;
}

// Function to find the order after a billion dances
function findOrderAfterBillionDances(moves, initialPrograms, repetitions) {
    let programs = initialPrograms.split('');
    const seen = [];
    let cycleDetected = false;

    for (let i = 0; i < repetitions; i++) {
        const currentOrder = programs.join('');
        if (seen.includes(currentOrder)) {
            // Cycle detected: break and use the cycle length
            cycleDetected = true;
            break;
        }

        seen.push(currentOrder);
        programs = dance(moves, programs);
    }

    if (cycleDetected) {
        const cycleLength = seen.length;
        const remaining = repetitions % cycleLength;
        programs = seen[remaining].split('');
    }

    return programs.join('');
}

// Main function
function main() {
    const filename = 'inputDay16.txt'; // Replace with your input file name
    const moves = parseMoves(filename);

    // Scenario 1: Compute the order after one dance
    const initialPrograms = 'abcdefghijklmnop'; // Initial order of programs
    const orderAfterOneDance = dance(moves, initialPrograms.split('')).join('');
    console.log(`The order of programs after one dance is: ${orderAfterOneDance}`);

    // Scenario 2: Compute the order after 1 billion dances
    const repetitions = 1000000000; // Total number of dances
    const finalOrder = findOrderAfterBillionDances(moves, initialPrograms, repetitions);
    console.log(`The final order of programs after a billion dances is: ${finalOrder}`);
}

// Execute the main function
main();
