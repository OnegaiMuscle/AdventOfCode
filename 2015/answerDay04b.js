const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');

if (isMainThread) {
    const secretKey = 'iwrupvqb';
    const numThreads = 7; // Number of threads to use
    let found = false;

    for (let i = 0; i < numThreads; i++) {
        const worker = new Worker(__filename, { workerData: { secretKey, start: i, step: numThreads } });
        worker.on('message', (number) => {
            if (!found) {
                found = true;
                console.log(`The lowest positive number that produces an MD5 hash starting with six zeroes is: ${number}`);
                process.exit(0);
            }
        });
    }
} else {
    const { secretKey, start, step } = workerData;
    let number = start;

    while (true) {
        const hashInput = secretKey + number;
        const hashResult = crypto.createHash('md5').update(hashInput).digest('hex');
        if (hashResult.startsWith('000000')) {
            parentPort.postMessage(number);
            break;
        }
        number += step;
    }
}
