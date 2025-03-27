
const fs = require("fs");

// Function to parse data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    return data.map(line => {
        const match = line.match(/position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/);
        if (match) {
            const [, x, y, vx, vy] = match.map(Number);
            return { x, y, vx, vy };
        }
        throw new Error("Invalid input format");
    });
}

// Function to calculate the bounds of the points (used to detect alignment)
function getBounds(points) {
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    return {
        minX: Math.min(...xValues),
        maxX: Math.max(...xValues),
        minY: Math.min(...yValues),
        maxY: Math.max(...yValues),
    };
}

// Function to print the points in their current positions
function printPoints(points) {
    const { minX, maxX, minY, maxY } = getBounds(points);
    const sky = Array.from({ length: maxY - minY + 1 }, () => Array(maxX - minX + 1).fill("."));
    points.forEach(({ x, y }) => {
        sky[y - minY][x - minX] = "#";
    });
    console.log(sky.map(row => row.join("")).join("\n"));
}

// Function to simulate the points until they align
function findMessage(points) {
    let time = 0;
    let prevArea = Infinity;

    while (true) {
        // Move points
        points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
        });

        // Calculate current bounds
        const { minX, maxX, minY, maxY } = getBounds(points);
        const area = (maxX - minX) * (maxY - minY);

        if (area > prevArea) {
            // The points are no longer aligning; stop and print the previous state
            points.forEach(point => {
                point.x -= point.vx; // Revert last movement
                point.y -= point.vy;
            });
            printPoints(points);
            console.log(`Message appears at time: ${time}`);
            break;
        }

        prevArea = area;
        time++;
    }
}

// Main function to parse data and find the message
function main(filePath) {
    const points = parseData(filePath);
    findMessage(points);
}

// Example usage
const inputFile = "inputDay10.txt"; // Replace with your text file path
main(inputFile);
