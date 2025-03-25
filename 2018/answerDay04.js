const fs = require('fs');

// Function to parse the log file and calculate both strategies
function analyzeGuardLogs(filePath) {
    // Read and sort the log entries
    const logs = fs.readFileSync(filePath, 'utf-8')
        .trim()
        .split('\n')
        .sort();

    const guards = {};
    let currentGuard = null;
    let sleepStart = null;

    // Process each log entry
    for (const log of logs) {
        const time = log.match(/\[.*\]/)[0];
        const minute = parseInt(time.slice(15, 17), 10);
        const action = log.slice(19);

        if (action.startsWith('Guard')) {
            currentGuard = parseInt(action.match(/#(\d+)/)[1], 10);
            if (!guards[currentGuard]) {
                guards[currentGuard] = { totalSleep: 0, minutes: Array(60).fill(0) };
            }
        } else if (action === 'falls asleep') {
            sleepStart = minute;
        } else if (action === 'wakes up') {
            for (let m = sleepStart; m < minute; m++) {
                guards[currentGuard].totalSleep += 1;
                guards[currentGuard].minutes[m] += 1;
            }
        }
    }

    // Strategy 1: Guard with the most total minutes asleep
    let sleepiestGuard = null;
    let maxSleep = 0;
    for (const [guard, data] of Object.entries(guards)) {
        if (data.totalSleep > maxSleep) {
            sleepiestGuard = guard;
            maxSleep = data.totalSleep;
        }
    }
    const sleepiestMinute = guards[sleepiestGuard].minutes.indexOf(Math.max(...guards[sleepiestGuard].minutes));
    const strategy1Result = sleepiestGuard * sleepiestMinute;

    // Strategy 2: Guard most frequently asleep on the same minute
    let frequentGuard = null;
    let frequentMinute = null;
    let maxFrequency = 0;
    for (const [guard, data] of Object.entries(guards)) {
        for (let m = 0; m < 60; m++) {
            if (data.minutes[m] > maxFrequency) {
                maxFrequency = data.minutes[m];
                frequentGuard = guard;
                frequentMinute = m;
            }
        }
    }
    const strategy2Result = frequentGuard * frequentMinute;

    return { strategy1Result, strategy2Result };
}

// Example usage
const { strategy1Result, strategy2Result } = analyzeGuardLogs('inputDay04.txt');
console.log(`Strategy 1 Result: ${strategy1Result}`);
console.log(`Strategy 2 Result: ${strategy2Result}`);
