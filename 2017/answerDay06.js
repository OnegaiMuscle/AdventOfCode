const fs = require('fs');

// Function to parse input from a text file
function parseInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim().split(/\s+/).map(Number);
}

// Function to calculate both the redistribution cycles and loop size
function redistributionCyclesAndLoopSize(memoryBanks) {
    const seenConfigurations = new Map();
    let cycles = 0;

    while (true) {
        const configKey = memoryBanks.join(',');
        if (seenConfigurations.has(configKey)) {
            const loopStartCycle = seenConfigurations.get(configKey);
            const loopSize = cycles - loopStartCycle;
            return { cycles, loopSize };
        }
        seenConfigurations.set(configKey, cycles);

        // Find the memory bank with the most blocks
        let maxBlocks = Math.max(...memoryBanks);
        let index = memoryBanks.indexOf(maxBlocks);

        // Redistribute the blocks
        memoryBanks[index] = 0;
        while (maxBlocks > 0) {
            index = (index + 1) % memoryBanks.length;
            memoryBanks[index]++;
            maxBlocks--;
        }

        cycles++;
    }
}

// Main function
function main() {
    const filePath = 'inputDay06.txt'; // Replace with your input file path
    const memoryBanks = parseInput(filePath);
    const { cycles, loopSize } = redistributionCyclesAndLoopSize(memoryBanks);
    console.log(`Number of redistribution cycles: ${cycles}`);
    console.log(`Size of the infinite loop: ${loopSize}`);
}

main();
