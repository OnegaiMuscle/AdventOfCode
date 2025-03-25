const fs = require('fs');

// Parse claims from a .txt file
function parseClaims(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.split('\n').filter(line => line.trim() !== '').map(parseClaim);
}

// Parse a single claim in the format "#123 @ 3,2: 5x4"
function parseClaim(line) {
    const [id, _, position, size] = line.split(' ');
    const [left, top] = position.slice(0, -1).split(',').map(Number);
    const [width, height] = size.split('x').map(Number);
    return { id: id.slice(1), left, top, width, height };
}

// Calculate the overlapping square inches and find intact claim
function findOverlapAndIntactClaim(claims) {
    const fabric = Array.from({ length: 1000 }, () => Array(1000).fill(0)); // 1000x1000 grid
    const claimMap = {}; // Track claims for overlap detection

    // Mark claims on fabric
    claims.forEach(({ id, left, top, width, height }) => {
        for (let row = top; row < top + height; row++) {
            for (let col = left; col < left + width; col++) {
                if (!fabric[row][col]) fabric[row][col] = [];
                fabric[row][col].push(id);
            }
        }
    });

    // Calculate overlap and identify intact claims
    let overlapCount = 0;
    const overlappingClaims = new Set();

    for (let row = 0; row < fabric.length; row++) {
        for (let col = 0; col < fabric[row].length; col++) {
            if (fabric[row][col].length > 1) {
                overlapCount++; // Square inch is overlapped
                fabric[row][col].forEach(id => overlappingClaims.add(id));
            }
        }
    }

    // Find claim that is not in overlappingClaims
    const intactClaim = claims.find(({ id }) => !overlappingClaims.has(id));

    return { overlapCount, intactClaim: intactClaim ? intactClaim.id : null };
}

// Main function
function main() {
    const filePath = 'inputDay03.txt'; // Replace with your file path
    const claims = parseClaims(filePath);

    if (claims.length === 0) {
        console.error("No valid claims found.");
        return;
    }

    const { overlapCount, intactClaim } = findOverlapAndIntactClaim(claims);

    console.log("Square inches within two or more claims:", overlapCount);
    console.log("ID of the intact claim:", intactClaim);
}

// Run the program
main();
