
const fs = require('fs');

// Function to parse the instructions from a text file
function parseInstructions(filePath) {
    return fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => {
        const [operationPart, conditionPart] = line.split(' if ');
        const [register, operation, value] = operationPart.split(' ');
        const [condRegister, operator, condValue] = conditionPart.split(' ');
        return {
            register,
            operation,
            value: parseInt(value, 10),
            condRegister,
            operator,
            condValue: parseInt(condValue, 10)
        };
    });
}

// Function to evaluate a condition
function evaluateCondition(registers, condRegister, operator, condValue) {
    const regValue = registers[condRegister] || 0;
    switch (operator) {
        case '>': return regValue > condValue;
        case '<': return regValue < condValue;
        case '>=': return regValue >= condValue;
        case '<=': return regValue <= condValue;
        case '==': return regValue === condValue;
        case '!=': return regValue !== condValue;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

// Function to execute the instructions and find the largest register value
function findLargestRegisterValue(instructions) {
    const registers = {};
    instructions.forEach(({ register, operation, value, condRegister, operator, condValue }) => {
        if (evaluateCondition(registers, condRegister, operator, condValue)) {
            registers[register] = registers[register] || 0;
            registers[register] += (operation === 'inc' ? value : -value);
        }
    });
    return Math.max(...Object.values(registers), 0);
}

// Main function
function main() {
    const filePath = 'inputday08.txt'; // Replace with your input file path
    const instructions = parseInstructions(filePath);
    const largestValue = findLargestRegisterValue(instructions);
    console.log(`The largest value in any register is: ${largestValue}`);
}

main();
