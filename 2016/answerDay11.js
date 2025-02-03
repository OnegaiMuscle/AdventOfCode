const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function isValidState(state) {
    for (let floor of state) {
        let generators = new Set();
        let microchips = new Set();
        for (let item of floor) {
            if (item.endsWith('G')) {
                generators.add(item[0]);
            } else {
                microchips.add(item[0]);
            }
        }
        if (microchips.size > 0 && generators.size > 0) {
            for (let chip of microchips) {
                if (!generators.has(chip)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function getNextStates(state, elevator) {
    let nextStates = [];
    let currentFloor = state[elevator];
    let items = [...currentFloor];
    for (let i = 0; i < items.length; i++) {
        for (let j = i; j < items.length; j++) {
            let newState = state.map(floor => new Set(floor));
            newState[elevator].delete(items[i]);
            if (i !== j) {
                newState[elevator].delete(items[j]);
            }
            if (elevator > 0) {
                newState[elevator - 1].add(items[i]);
                if (i !== j) {
                    newState[elevator - 1].add(items[j]);
                }
                if (isValidState(newState)) {
                    nextStates.push([newState, elevator - 1]);
                }
                newState[elevator - 1].delete(items[i]);
                if (i !== j) {
                    newState[elevator - 1].delete(items[j]);
                }
            }
            if (elevator < 3) {
                newState[elevator + 1].add(items[i]);
                if (i !== j) {
                    newState[elevator + 1].add(items[j]);
                }
                if (isValidState(newState)) {
                    nextStates.push([newState, elevator + 1]);
                }
            }
        }
    }
    return nextStates;
}

function serializeState(state, elevator) {
    return JSON.stringify(state.map(floor => [...floor].sort())) + elevator;
}

function minStepsToAssemble(state, elevator) {
    let queue = [[state, elevator, 0]];
    let visited = new Set();
    visited.add(serializeState(state, elevator));
    while (queue.length > 0) {
        let [currentState, currentElevator, steps] = queue.shift();
        if (currentState[3].size === 10) {
            return steps;
        }
        for (let [nextState, nextElevator] of getNextStates(currentState, currentElevator)) {
            let serializedState = serializeState(nextState, nextElevator);
            if (!visited.has(serializedState)) {
                visited.add(serializedState);
                queue.push([nextState, nextElevator, steps + 1]);
            }
        }
    }
    return -1;
}

// Exemple d'utilisation
const data = parseData('inputDay11.txt');
const initialState = [
    new Set(['PG', 'TG', 'TM', 'RG', 'CG', 'RM', 'PM', 'CM']),
    new Set(['PM', 'CM']),
    new Set(),
    new Set()
];
const initialElevator = 0;
const steps = minStepsToAssemble(initialState, initialElevator);
console.log(`Minimum number of steps: ${steps}`);
