const fs = require("fs");

// Parse the instructions from a text file
function parseInstructionsFromFile(filePath) {
    const data = fs.readFileSync(filePath, "utf-8");
    return data.split("\n").map(line => {
        const match = line.match(/Step (\w) must be finished before step (\w) can begin./);
        if (!match) return null; // Ignore invalid lines
        return { prerequisite: match[1], step: match[2] };
    }).filter(instruction => instruction !== null); // Remove null entries
}

// Build the dependency graph
function buildDependencyGraph(instructions) {
    const graph = new Map();

    instructions.forEach(({ prerequisite, step }) => {
        if (!graph.has(step)) graph.set(step, new Set());
        if (!graph.has(prerequisite)) graph.set(prerequisite, new Set());
        graph.get(step).add(prerequisite);
    });

    return graph;
}

// Determine the order of steps
function determineStepOrder(dependencyGraph) {
    const order = [];
    const availableSteps = new Set([...dependencyGraph.keys()].filter(step => dependencyGraph.get(step).size === 0));

    while (availableSteps.size > 0) {
        const nextStep = [...availableSteps].sort()[0]; // Choose the first step alphabetically
        order.push(nextStep);
        availableSteps.delete(nextStep);

        dependencyGraph.forEach((dependencies, step) => {
            if (dependencies.has(nextStep)) {
                dependencies.delete(nextStep);
                if (dependencies.size === 0) availableSteps.add(step);
            }
        });
    }

    return order.join("");
}

// Calculate the time required to complete the steps using workers
function calculateCompletionTime(dependencyGraph, numWorkers, baseTime) {
    const workers = Array(numWorkers).fill(null); // Track tasks each worker is performing
    const taskEndTimes = Array(numWorkers).fill(0); // Track when tasks will end for each worker
    const completedTasks = new Set(); // Tasks that are fully completed
    let time = 0;

    const availableSteps = new Set([...dependencyGraph.keys()].filter(step => dependencyGraph.get(step).size === 0));

    while (completedTasks.size < dependencyGraph.size) {
        // Assign available steps to idle workers
        for (let i = 0; i < numWorkers; i++) {
            if (taskEndTimes[i] <= time && !workers[i]) {
                const nextStep = [...availableSteps].sort()[0]; // Alphabetically first step
                if (nextStep) {
                    workers[i] = nextStep;
                    taskEndTimes[i] = time + baseTime + (nextStep.charCodeAt(0) - "A".charCodeAt(0) + 1);
                    availableSteps.delete(nextStep);
                }
            }
        }

        // Advance to the next event (minimum task end time)
        const nextEventTime = Math.min(...taskEndTimes.filter(endTime => endTime > time));
        time = nextEventTime;

        // Finish tasks and free up workers
        for (let i = 0; i < numWorkers; i++) {
            if (taskEndTimes[i] === time) {
                const finishedTask = workers[i];
                completedTasks.add(finishedTask);
                workers[i] = null;

                dependencyGraph.forEach((dependencies, step) => {
                    if (dependencies.has(finishedTask)) {
                        dependencies.delete(finishedTask);
                        if (dependencies.size === 0) {
                            availableSteps.add(step);
                        }
                    }
                });
            }
        }
    }

    return time;
}

// Main function to solve both problems
function solve(filePath, numWorkers, baseTime) {
    const instructions = parseInstructionsFromFile(filePath);
    console.log("Parsed instructions:", instructions);

    const dependencyGraph = buildDependencyGraph(instructions);
    console.log("Dependency graph:", dependencyGraph);

    // Part 1: Determine the order of steps
    const stepOrder = determineStepOrder(new Map([...dependencyGraph.entries()].map(([k, v]) => [k, new Set(v)]))); // Clone graph
    console.log("Order of steps:", stepOrder);

    // Part 2: Calculate the time to complete steps with multiple workers
    const completionTime = calculateCompletionTime(dependencyGraph, numWorkers, baseTime);
    console.log(`Total time to complete all steps with ${numWorkers} workers:`, completionTime);

    return { stepOrder, completionTime };
}

// Example usage: Replace 'instructions.txt' with your input file
// Set number of workers (e.g., 5) and base time (e.g., 60 seconds)
solve("inputDay07.txt", 5, 60);
