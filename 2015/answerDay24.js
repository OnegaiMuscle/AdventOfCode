const fs = require('fs');

function parseWeights(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .map(line => parseInt(line.trim()))
        .filter(weight => !isNaN(weight));
}

function findIdealConfiguration(weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const targetWeight = totalWeight / 3;

    function getCombinations(arr, target) {
        const result = [];
        function helper(start, combo, sum) {
            if (sum === target) {
                result.push(combo);
                return;
            }
            if (sum > target || start >= arr.length) return;
            for (let i = start; i < arr.length; i++) {
                helper(i + 1, combo.concat(arr[i]), sum + arr[i]);
            }
        }
        helper(0, [], 0);
        return result;
    }

    const group1Combinations = getCombinations(weights, targetWeight);
    group1Combinations.sort((a, b) => a.length - b.length || a.reduce((prod, w) => prod * w, 1) - b.reduce((prod, w) => prod * w, 1));

    for (const group1 of group1Combinations) {
        const remainingWeights = weights.filter(w => !group1.includes(w));
        const group2Combinations = getCombinations(remainingWeights, targetWeight);
        for (const group2 of group2Combinations) {
            const group3 = remainingWeights.filter(w => !group2.includes(w));
            if (group3.reduce((sum, w) => sum + w, 0) === targetWeight) {
                return group1.reduce((prod, w) => prod * w, 1);
            }
        }
    }

    return null;
}

// Example usage:
const filePath = '.txt';
const weights = parseWeights(filePath);
const quantumEntanglement = findIdealConfiguration(weights);
console.log(`The quantum entanglement of the first group of packages in the ideal configuration is: ${quantumEntanglement}`);
