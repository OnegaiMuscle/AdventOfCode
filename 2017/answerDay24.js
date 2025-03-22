
const fs = require('fs');

// Function to parse the components from the input file
function parseComponents(filename) {
    const data = fs.readFileSync(filename, 'utf-8').trim();
    return data.split('\n').map(line => {
        const [a, b] = line.split('/').map(Number);
        return { a, b };
    });
}

// Recursive function to find the strongest bridge
function findStrongestBridge(components, currentPort = 0, currentBridge = []) {
    let maxStrength = currentBridge.reduce((sum, { a, b }) => sum + a + b, 0);

    for (let i = 0; i < components.length; i++) {
        const { a, b } = components[i];
        if (a === currentPort || b === currentPort) {
            const nextPort = a === currentPort ? b : a;
            const remainingComponents = components.filter((_, index) => index !== i);
            const bridgeStrength = findStrongestBridge(remainingComponents, nextPort, [...currentBridge, components[i]]);
            maxStrength = Math.max(maxStrength, bridgeStrength);
        }
    }

    return maxStrength;
}

// Main function
function main() {
    const filename = 'inputDay24.txt'; // Replace with your actual input file name
    const components = parseComponents(filename);
    const strongestBridgeStrength = findStrongestBridge(components);
    console.log(`The strength of the strongest bridge is: ${strongestBridgeStrength}`);
}

// Execute the main function
main();
