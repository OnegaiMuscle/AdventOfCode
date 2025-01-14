const fs = require('fs');

function parseAuntSueData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const aunts = [];

    lines.forEach(line => {
        const parts = line.match(/Sue (\d+): (.+)/);
        if (parts) {
            const [_, number, attributes] = parts;
            const attributesObj = {};
            attributes.split(', ').forEach(attr => {
                const [key, value] = attr.split(': ');
                attributesObj[key] = parseInt(value);
            });
            aunts.push({ number: parseInt(number), attributes: attributesObj });
        }
    });

    return aunts;
}

function findMatchingAuntSue(aunts, analysisResults) {
    for (const aunt of aunts) {
        let match = true;
        for (const [key, value] of Object.entries(analysisResults)) {
            if (key in aunt.attributes) {
                if (key === 'cats' || key === 'trees') {
                    if (aunt.attributes[key] <= value) {
                        match = false;
                        break;
                    }
                } else if (key === 'pomeranians' || key === 'goldfish') {
                    if (aunt.attributes[key] >= value) {
                        match = false;
                        break;
                    }
                } else {
                    if (aunt.attributes[key] !== value) {
                        match = false;
                        break;
                    }
                }
            }
        }
        if (match) {
            return aunt.number;
        }
    }
    return null;
}

// Example usage:
const filePath = 'inputDay16.txt'; // Replace with the path to your text file
const aunts = parseAuntSueData(filePath);
const analysisResults = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
};

const matchingAuntSue = findMatchingAuntSue(aunts, analysisResults);
console.log('Matching Aunt Sue:', matchingAuntSue);
