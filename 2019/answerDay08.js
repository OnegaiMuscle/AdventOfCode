const fs = require('fs');

// Function to parse image data from a text file
function parseImageData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    return data.split('').map(Number);
}

// Function to split the image data into layers
function getLayers(imageData, width, height) {
    const layerSize = width * height;
    const layers = [];

    for (let i = 0; i < imageData.length; i += layerSize) {
        layers.push(imageData.slice(i, i + layerSize));
    }

    return layers;
}

// Function to find the layer with the fewest 0 digits
function findLayerWithFewestZeros(layers) {
    let minZeroCount = Infinity;
    let targetLayer = null;

    for (const layer of layers) {
        const zeroCount = layer.filter(pixel => pixel === 0).length;
        if (zeroCount < minZeroCount) {
            minZeroCount = zeroCount;
            targetLayer = layer;
        }
    }

    return targetLayer;
}

// Function to calculate the checksum (number of 1 digits multiplied by number of 2 digits)
function calculateChecksum(layer) {
    const ones = layer.filter(pixel => pixel === 1).length;
    const twos = layer.filter(pixel => pixel === 2).length;
    return ones * twos;
}

// Function to decode the image
function decodeImage(layers, width, height) {
    const finalImage = new Array(width * height).fill(2); // Start with transparent pixels

    for (const layer of layers) {
        for (let i = 0; i < layer.length; i++) {
            if (finalImage[i] === 2) { // Replace only transparent pixels
                finalImage[i] = layer[i];
            }
        }
    }

    return finalImage;
}

// Function to render the final image as a readable string
function renderImage(imageData, width) {
    let output = '';
    for (let i = 0; i < imageData.length; i++) {
        output += imageData[i] === 1 ? '█' : ' '; // White pixel is "█", black is space
        if ((i + 1) % width === 0) output += '\n'; // New row after every 'width' pixels
    }
    return output;
}

// Main execution
function main() {
    const filePath = 'inputDay08.txt'; // Change to actual file path
    const width = 25; // Image width
    const height = 6; // Image height

    const imageData = parseImageData(filePath);
    const layers = getLayers(imageData, width, height);

    // Calculate checksum
    const targetLayer = findLayerWithFewestZeros(layers);
    const checksum = calculateChecksum(targetLayer);
    console.log(`Checksum (1 digits * 2 digits): ${checksum}`);

    // Decode image
    const finalImage = decodeImage(layers, width, height);
    console.log(`Decoded Image:\n${renderImage(finalImage, width)}`);
}

main();
