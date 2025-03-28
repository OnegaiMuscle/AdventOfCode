
const fs = require("fs");

// Function to parse input data from a text file
function parseData(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").split("\n");
    const tracks = [];
    const carts = [];

    data.forEach((line, y) => {
        const trackLine = line.split("");
        trackLine.forEach((char, x) => {
            if ("^v<>".includes(char)) {
                // Add cart to carts array
                carts.push({
                    x,
                    y,
                    direction: char,
                    turnIndex: 0 // Keeps track of left/straight/right turns
                });

                // Replace cart with the correct track under it
                trackLine[x] = "^v".includes(char) ? "|" : "-";
            }
        });
        tracks.push(trackLine);
    });

    return { tracks, carts };
}

// Function to simulate the cart movements and detect the first crash
function findFirstCrash(tracks, carts) {
    const directions = {
        "^": { dx: 0, dy: -1 },
        "v": { dx: 0, dy: 1 },
        "<": { dx: -1, dy: 0 },
        ">": { dx: 1, dy: 0 }
    };

    const turnOrder = ["left", "straight", "right"];
    const turnLeft = { "^": "<", "<": "v", "v": ">", ">": "^" };
    const turnRight = { "^": ">", ">": "v", "v": "<", "<": "^" };

    while (true) {
        // Sort carts by their reading order (top-to-bottom, left-to-right)
        carts.sort((a, b) => a.y - b.y || a.x - b.x);

        for (let i = 0; i < carts.length; i++) {
            const cart = carts[i];
            const { dx, dy } = directions[cart.direction];

            // Move the cart
            cart.x += dx;
            cart.y += dy;

            // Check for crashes
            for (let j = 0; j < carts.length; j++) {
                if (i !== j && carts[j].x === cart.x && carts[j].y === cart.y) {
                    // Crash detected
                    return { x: cart.x, y: cart.y };
                }
            }

            // Update cart direction based on the track
            const track = tracks[cart.y][cart.x];
            if (track === "/") {
                cart.direction = cart.direction === "^" ? ">" :
                                 cart.direction === "v" ? "<" :
                                 cart.direction === ">" ? "^" : "v";
            } else if (track === "\\") {
                cart.direction = cart.direction === "^" ? "<" :
                                 cart.direction === "v" ? ">" :
                                 cart.direction === ">" ? "v" : "^";
            } else if (track === "+") {
                const turn = turnOrder[cart.turnIndex];
                cart.turnIndex = (cart.turnIndex + 1) % 3; // Cycle through turns
                if (turn === "left") {
                    cart.direction = turnLeft[cart.direction];
                } else if (turn === "right") {
                    cart.direction = turnRight[cart.direction];
                }
            }
        }
    }
}

// Main function to parse data and find the first crash
function main(filePath) {
    const { tracks, carts } = parseData(filePath);
    const crash = findFirstCrash(tracks, carts);
    console.log(`First crash occurs at: ${crash.x},${crash.y}`);
}

// Example usage
const inputFile = "inputDay13.txt"; // Replace with your input file path
main(inputFile);
