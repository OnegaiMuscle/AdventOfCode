const fs = require("fs");

// Function to parse input data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    const initialState = data[0].match(/initial state: (.+)/)[1]; // Extract the initial state
    const rules = data.slice(2).reduce((acc, line) => {
        const [pattern, result] = line.split(" => ");
        acc[pattern] = result;
        return acc;
    }, {});
    return { initialState, rules };
}

// Function to simulate plant growth over generations
function simulateGenerations(initialState, rules, generations) {
    let state = initialState;
    let zeroIndex = 0; // Tracks the position of pot 0 in the current state

    for (let gen = 0; gen < generations; gen++) {
        // Pad state with dots to account for potential plant growth at the edges
        state = `....${state}....`;
        zeroIndex += 4; // Adjust zeroIndex for padding

        let newState = "";
        for (let i = 2; i < state.length - 2; i++) {
            const segment = state.slice(i - 2, i + 3); // Extract 5-pot segment
            newState += rules[segment] || "."; // Apply the rules or default to '.'
        }

        state = newState;
        // Trim unnecessary dots to keep the state manageable
        state = state.replace(/^\.+/, "");
        zeroIndex -= (state.match(/^\.+/) || [""])[0].length;
        state = state.replace(/\.+$/, "");
    }

    // Calculate the sum of all pot numbers containing plants (#)
    return state.split("").reduce((sum, pot, index) => {
        if (pot === "#") sum += index - zeroIndex;
        return sum;
    }, 0);
}

// Main function to parse data and run the simulation
function main(filePath, generations = 20) {
    const { initialState, rules } = parseData(filePath);
    const result = simulateGenerations(initialState, rules, generations);
    console.log(`Sum of plant-containing pots after ${generations} generations: ${result}`);
}

// Example usage
const inputFile = "inputDay12.txt"; // Replace with your input file path
main(inputFile);
