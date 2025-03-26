const fs = require("fs");

// Parse the license file from a text file
function parseLicenseFile(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim();
    return data.split(" ").map(Number);
}

// Parse the tree and calculate the metadata sum and node values
function parseNode(data, index = 0) {
    const childCount = data[index]; // Number of child nodes
    const metadataCount = data[index + 1]; // Number of metadata entries
    index += 2; // Move past the header

    let metadataSum = 0;
    const childValues = [];

    // Recursively parse child nodes
    for (let i = 0; i < childCount; i++) {
        const result = parseNode(data, index);
        metadataSum += result.metadataSum;
        childValues.push(result.nodeValue);
        index = result.nextIndex; // Update index to continue parsing
    }

    // Process metadata entries
    const metadata = data.slice(index, index + metadataCount);
    metadataSum += metadata.reduce((sum, value) => sum + value, 0);

    let nodeValue = 0;
    if (childCount === 0) {
        // Node has no child nodes, value is the sum of metadata entries
        nodeValue = metadata.reduce((sum, value) => sum + value, 0);
    } else {
        // Node has child nodes, value is determined by metadata as indexes
        nodeValue = metadata.reduce((sum, value) => {
            const childIndex = value - 1; // Convert 1-based index to 0-based
            if (childIndex >= 0 && childIndex < childValues.length) {
                return sum + childValues[childIndex];
            }
            return sum;
        }, 0);
    }

    return { metadataSum, nodeValue, nextIndex: index + metadataCount };
}

// Main function to calculate both results
function solveLicenseFile(filePath) {
    const data = parseLicenseFile(filePath);
    const result = parseNode(data);

    console.log("Sum of all metadata entries:", result.metadataSum);
    console.log("Value of the root node:", result.nodeValue);

    return {
        metadataSum: result.metadataSum,
        rootNodeValue: result.nodeValue,
    };
}

// Example usage
// Replace "license.txt" with the path to your input file
const results = solveLicenseFile("inputDay08.txt");
console.log("Results:", results);
