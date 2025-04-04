const fs = require('fs');

function calculateFuel(mass) {
    return Math.floor(mass / 3) - 2;
}

function getTotalFuelRequirement(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const masses = data.trim().split('\n').map(Number);
    return masses.reduce((totalFuel, mass) => totalFuel + calculateFuel(mass), 0);
}

// Example usage
const totalFuel = getTotalFuelRequirement('inputDay01.txt');
console.log('Total fuel requirement:', totalFuel);
