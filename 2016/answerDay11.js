const itemsPartOne = [4, 2, 4, 0];
const itemsPartTwo = [8, 2, 4, 0];

function getMoves(items) {
    
    let moves = 0;
    while (items[items.length - 1] !== items.reduce((a, b) => a + b, 0)) {
        // console.log(moves, items);
        let lowestFloor = 0;
        while (items[lowestFloor] === 0) {
            lowestFloor++;
        }
        moves += 2 * (items[lowestFloor] - 1) - 1;
        items[lowestFloor + 1] += items[lowestFloor];
        items[lowestFloor] = 0;
    }
    return moves;
}

console.log("Part One");
console.log(getMoves(itemsPartOne));
console.log("");
console.log("Part Two");
console.log(getMoves(itemsPartTwo));
