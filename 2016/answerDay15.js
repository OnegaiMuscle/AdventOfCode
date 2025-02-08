


const fs = require('fs');
const path = require('path');

// Function to parse data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim();
    const discs = data.split('\n').map(line => {
        const parts = line.match(/Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./);
        return {
            positions: parseInt(parts[2], 10),
            initialPosition: parseInt(parts[3], 10),
        };
    });
    // Add the new disc with 11 positions and starting at position 0
    discs.push({ positions: 11, initialPosition: 0 });
    return discs;
}

// Function to find the first alignment time
function findFirstAlignmentTime(discs) {
    let time = 0;
    while (true) {
        let allAligned = true;
        for (let i = 0; i < discs.length; i++) {
            const disc = discs[i];
            const discPositionAtTime = (disc.initialPosition + time + i + 1) % disc.positions;
            if (discPositionAtTime !== 0) {
                allAligned = false;
                break;
            }
        }
        if (allAligned) {
            return time;
        }
        time++;
    }
}

// Main function to execute the solution
function main() {
    const filePath = path.join(__dirname, 'inputDay15.txt');
    const discs = parseData(filePath);
    const alignmentTime = findFirstAlignmentTime(discs);
    console.log(`The first time you can press the button to get a capsule is ${alignmentTime}`);
}

main()
