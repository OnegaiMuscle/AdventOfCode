const fs = require("fs");

// Function to parse input data
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim().split("\n");
    const clayCoordinates = new Set();

    let minY = Infinity, maxY = -Infinity;
    let minX = Infinity, maxX = -Infinity;

    data.forEach(line => {
        const xMatch = line.match(/x=(\d+), y=(\d+)\.\.(\d+)/);
        const yMatch = line.match(/y=(\d+), x=(\d+)\.\.(\d+)/);

        if (xMatch) {
            const x = parseInt(xMatch[1]);
            const yStart = parseInt(xMatch[2]);
            const yEnd = parseInt(xMatch[3]);

            for (let y = yStart; y <= yEnd; y++) {
                clayCoordinates.add(`${x},${y}`);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
        } else if (yMatch) {
            const y = parseInt(yMatch[1]);
            const xStart = parseInt(yMatch[2]);
            const xEnd = parseInt(yMatch[3]);

            for (let x = xStart; x <= xEnd; x++) {
                clayCoordinates.add(`${x},${y}`);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
        }
    });

    return { clayCoordinates, minX, maxX, minY, maxY };
}

// Function to simulate water flow
function simulateWaterFlow(clayCoordinates, minX, maxX, minY, maxY) {
    const waterReachable = new Set();
    const settledWater = new Set();

    const spring = { x: 500, y: 0 };
    const queue = [spring];

    while (queue.length > 0) {
        const { x, y } = queue.pop();

        // Ignore tiles outside the bounds
        if (y > maxY) {
            continue;
        }

        const coord = `${x},${y}`;
        if (waterReachable.has(coord)) {
            continue;
        }
        waterReachable.add(coord);

        // Move downward
        const below = `${x},${y + 1}`;
        if (!clayCoordinates.has(below) && !settledWater.has(below)) {
            queue.push({ x, y: y + 1 });
            continue;
        }

        // Spread left
        let left = x;
        let boundedLeft = false;
        while (!clayCoordinates.has(`${left - 1},${y}`) &&
               (clayCoordinates.has(`${left},${y + 1}`) || settledWater.has(`${left},${y + 1}`))) {
            waterReachable.add(`${left},${y}`);
            left--;
        }
        if (clayCoordinates.has(`${left},${y}`)) {
            boundedLeft = true;
        }

        // Spread right
        let right = x;
        let boundedRight = false;
        while (!clayCoordinates.has(`${right + 1},${y}`) &&
               (clayCoordinates.has(`${right},${y + 1}`) || settledWater.has(`${right},${y + 1}`))) {
            waterReachable.add(`${right},${y}`);
            right++;
        }
        if (clayCoordinates.has(`${right},${y}`)) {
            boundedRight = true;
        }

        // If bounded on both sides, mark as settled water
        if (boundedLeft && boundedRight) {
            for (let i = left + 1; i < right; i++) {
                settledWater.add(`${i},${y}`);
            }
        } else {
            // If not bounded, water flows further
            if (!boundedLeft) {
                queue.push({ x: left, y });
            }
            if (!boundedRight) {
                queue.push({ x: right, y });
            }
        }
    }

    return { waterReachable, settledWater };
}

// Main function
function main(filePath) {
    const { clayCoordinates, minX, maxX, minY, maxY } = parseData(filePath);
    const { waterReachable, settledWater } = simulateWaterFlow(clayCoordinates, minX, maxX, minY, maxY);

    // Debugging: Log the size of waterReachable and settledWater
    console.log(`Water Reachable: ${waterReachable.size}`);
    console.log(`Settled Water: ${settledWater.size}`);

    const result = Array.from(waterReachable)
                        .filter(coord => {
                            const [_, y] = coord.split(",").map(Number);
                            return y >= minY && y <= maxY;
                        }).length;

    console.log(`Number of tiles water can reach: ${result}`);
}

// Example usage
const inputFile = "inputDay17.txt"; // Replace with your input file path
main(inputFile);
