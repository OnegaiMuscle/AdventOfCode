const fs = require("fs");

// Node structure for the linked list
class Node {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

// Circular doubly-linked list implementation
class LinkedList {
    constructor() {
        this.current = null;
    }

    insertAfter(value) {
        const newNode = new Node(value);
        if (!this.current) {
            // Initialize the list with the first node
            newNode.next = newNode;
            newNode.prev = newNode;
            this.current = newNode;
        } else {
            const nextNode = this.current.next;
            this.current.next = newNode;
            newNode.prev = this.current;
            newNode.next = nextNode;
            nextNode.prev = newNode;
            this.current = newNode; // Move to the inserted node
        }
    }

    removeCurrent() {
        const value = this.current.value;
        const prevNode = this.current.prev;
        const nextNode = this.current.next;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        this.current = nextNode; // Move to the next node
        return value; // Return the removed value
    }

    move(steps) {
        while (steps > 0) {
            this.current = this.current.next;
            steps--;
        }
        while (steps < 0) {
            this.current = this.current.prev;
            steps++;
        }
    }
}

// Function to calculate the highest score using the linked list
function getWinningScoreOptimized(players, lastMarble) {
    const scores = new Array(players).fill(0);
    const circle = new LinkedList();
    circle.insertAfter(0); // Start with the initial marble
    let currentPlayer = 0;

    for (let marble = 1; marble <= lastMarble; marble++) {
        if (marble % 23 === 0) {
            // Special case for multiples of 23
            scores[currentPlayer] += marble;
            circle.move(-7); // Move counter-clockwise 7 steps
            scores[currentPlayer] += circle.removeCurrent(); // Remove and add its value
        } else {
            // Normal placement: move 1 step clockwise and insert
            circle.move(1);
            circle.insertAfter(marble);
        }
        currentPlayer = (currentPlayer + 1) % players; // Next player's turn
    }

    return Math.max(...scores); // Return the highest score
}

// Function to calculate for normal and scaled scenarios
function calculateScoresOptimized(filePath) {
    const data = fs.readFileSync(filePath, "utf-8").trim();
    const match = data.match(/(\d+) players; last marble is worth (\d+) points/);
    if (!match) throw new Error("Invalid input format");
    const players = parseInt(match[1]);
    const lastMarble = parseInt(match[2]);

    // Case 1: Regular last marble value
    console.log(`Winning Elf's Score (Regular): ${getWinningScoreOptimized(players, lastMarble)}`);

    // Case 2: Last marble value scaled 100 times
    console.log(`Winning Elf's Score (Scaled): ${getWinningScoreOptimized(players, lastMarble * 100)}`);
}

// Example usage
const inputFile = "inputDay09.txt"; // Replace with your text file
calculateScoresOptimized(inputFile);


//Why is this Faster?
//Efficient Insertions/Deletions: In a linked list, insertion and deletion are performed in O(1) time compared to O(n) for an array due to splice.

//Constant Memory for Circle: The linked list dynamically allocates nodes, so memory usage remains efficient even with large numbers of marbles.
