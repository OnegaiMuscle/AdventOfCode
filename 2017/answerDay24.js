const fs = require('fs');

// Function to parse the components from the input file
function parseComponents(filename) {
    const data = fs.readFileSync(filename, 'utf-8').trim();
    return data.split('\n').map(line => {
        const [a, b] = line.split('/').map(Number);
        return { a, b };
    });
}

// Recursive function to find the strongest and longest bridge
function findBridges(components, currentPort = 0, currentBridge = []) {
    const currentStrength = currentBridge.reduce((sum, { a, b }) => sum + a + b, 0);
    const currentLength = currentBridge.length;

    let strongestBridge = { strength: currentStrength, length: currentLength };
    let longestStrongestBridge = { strength: currentStrength, length: currentLength };

    for (let i = 0; i < components.length; i++) {
        const { a, b } = components[i];
        if (a === currentPort || b === currentPort) {
            const nextPort = a === currentPort ? b : a;
            const remainingComponents = components.filter((_, index) => index !== i);
            const { strongest, longestStrongest } = findBridges(
                remainingComponents,
                nextPort,
                [...currentBridge, components[i]]
            );

            // Update strongest bridge
            if (strongest.strength > strongestBridge.strength) {
                strongestBridge = strongest;
            }

            // Update longest-strongest bridge
            if (
                longestStrongest.length > longestStrongestBridge.length ||
                (longestStrongest.length === longestStrongestBridge.length &&
                    longestStrongest.strength > longestStrongestBridge.strength)
            ) {
                longestStrongestBridge = longestStrongest;
            }
        }
    }

    return { strongest: strongestBridge, longestStrongest: longestStrongestBridge };
}

// Main function
function main() {
    const filename = 'inputDay24.txt'; // Replace with your actual input file name
    const components = parseComponents(filename);
    const { strongest, longestStrongest } = findBridges(components);

    console.log(`The strength of the strongest bridge is: ${strongest.strength}`);
    console.log(`The strength of the longest bridge is: ${longestStrongest.strength}`);
}

// Execute the main function
main();
