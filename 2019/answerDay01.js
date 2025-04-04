const fs = require('fs');

function calculateFuel(mass) {
    return Math.floor(mass / 3) - 2;
}

function calculateTotalFuel(mass) {
    let totalFuel = 0;
    while (mass > 0) {
        mass = calculateFuel(mass);
        if (mass > 0) totalFuel += mass;
    }
    return totalFuel;
}

function getFuelRequirements(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const masses = data.trim().split('\n').map(Number);

    const basicFuel = masses.reduce((totalFuel, mass) => totalFuel + calculateFuel(mass), 0);
    const totalFuel = masses.reduce((totalFuel, mass) => totalFuel + calculateTotalFuel(mass), 0);

    return { basicFuel, totalFuel };
}

// Example usage
const fuelRequirements = getFuelRequirements('inputDay01.txt');
console.log('Basic fuel requirement:', fuelRequirements.basicFuel);
console.log('Total fuel requirement (including fuel for fuel):', fuelRequirements.totalFuel);
