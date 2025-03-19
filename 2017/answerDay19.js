const fs = require('fs');

// Function to parse the routing diagram from a text file
function parseDiagram(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.split('\n').map(line => line.split(''));
}

// Function to follow the path and collect letters
function followPath(diagram) {
    let x = diagram[0].indexOf('|'); // Find the starting point (first '|')
    let y = 0; // Starting at the top row
    let direction = 'down'; // Initial direction
    let letters = '';
    let steps = 0; // Optional, to count the steps (not requested)

    // Function to check if a position is within the bounds of the diagram
    function isInBounds(x, y) {
        return y >= 0 && y < diagram.length && x >= 0 && x < diagram[y].length;
    }

    while (true) {
        const currentChar = diagram[y][x];

        if (currentChar === ' ') {
            // End of the path
            break;
        }

        if (/[A-Z]/.test(currentChar)) {
            // Collect letters
            letters += currentChar;
        }

        if (currentChar === '+') {
            // Change direction at intersections
            if (direction === 'up' || direction === 'down') {
                // Look left or right
                if (isInBounds(x - 1, y) && diagram[y][x - 1] !== ' ') {
                    direction = 'left';
                } else if (isInBounds(x + 1, y) && diagram[y][x + 1] !== ' ') {
                    direction = 'right';
                }
            } else if (direction === 'left' || direction === 'right') {
                // Look up or down
                if (isInBounds(x, y - 1) && diagram[y - 1][x] !== ' ') {
                    direction = 'up';
                } else if (isInBounds(x, y + 1) && diagram[y + 1][x] !== ' ') {
                    direction = 'down';
                }
            }
        }

        // Move in the current direction
        if (direction === 'up') {
            y--;
        } else if (direction === 'down') {
            y++;
        } else if (direction === 'left') {
            x--;
        } else if (direction === 'right') {
            x++;
        }

        steps++;
    }

    return { letters, steps }; // Return collected letters and optional step count
}

// Main function
function main() {
    const filename = 'inputDay19.txt'; // Replace with your input file name
    const diagram = parseDiagram(filename);
    const result = followPath(diagram);

    console.log(`The letters seen on the path are: ${result.letters}`);
    console.log(`The total number of steps taken is: ${result.steps}`); // Optional
}

// Execute the main function
main();
