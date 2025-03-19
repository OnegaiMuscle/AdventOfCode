const { parentPort, workerData } = require('worker_threads');

// Function to enhance a single subgrid
function enhanceSubgrid(subgrid, rules) {
    const key = subgrid.map(row => row.join('')).join('/');
    return rules[key];
}

// Enhance subgrids sent to this worker
function processSubgrids(subgrids, rules) {
    return subgrids.map(subgrid => enhanceSubgrid(subgrid, rules));
}

// Receive data and process it
const { subgrids, rules } = workerData;
const enhancedSubgrids = processSubgrids(subgrids, rules);

// Send the result back to the main thread
parentPort.postMessage(enhancedSubgrids);
