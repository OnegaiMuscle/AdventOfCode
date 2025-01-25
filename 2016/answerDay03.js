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

const triangles = parseData('inputDay03.txt');
const validTrianglesCount = countValidTriangles(triangles);
console.log(`Number of valid triangles: ${validTrianglesCount}`);


function parseDatabis(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number));
    const triangles = [];

    for (let i = 0; i < lines.length; i += 3) {
        for (let j = 0; j < 3; j++) {
            triangles.push([lines[i][j], lines[i + 1][j], lines[i + 2][j]]);
        }
    }

    return triangles;
}

const trianglesbis = parseDatabis('inputDay03.txt');
const validTrianglesCountbis = countValidTriangles(trianglesbis);
console.log(`Number of valid triangles: ${validTrianglesCountbis}`);
