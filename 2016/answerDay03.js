const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number));
}

function isValidTriangle(sides) {
    const [a, b, c] = sides;
    return (a + b > c) && (a + c > b) && (b + c > a);
}

function countValidTriangles(triangles) {
    return triangles.filter(isValidTriangle).length;
}

// Exemple d'utilisation
const triangles = parseData('inputDay03.txt');
const validTrianglesCount = countValidTriangles(triangles);
console.log(`Number of valid triangles: ${validTrianglesCount}`);
