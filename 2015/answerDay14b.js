const fs = require('fs');

function parseReindeerData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const reindeerData = [];

    lines.forEach(line => {
        const parts = line.match(/(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./);
        if (parts) {
            const [_, name, speed, flyTime, restTime] = parts;
            reindeerData.push({
                name,
                speed: parseInt(speed),
                flyTime: parseInt(flyTime),
                restTime: parseInt(restTime)
            });
        }
    });

    return reindeerData;
}

function calculateDistance(speed, flyTime, restTime, totalTime) {
    const cycleTime = flyTime + restTime;
    const fullCycles = Math.floor(totalTime / cycleTime);
    const remainingTime = totalTime % cycleTime;
    const flyingTime = fullCycles * flyTime + Math.min(remainingTime, flyTime);
    return flyingTime * speed;
}

function findWinningReindeer(reindeerData, totalTime) {
    const points = {};
    const distances = {};

    reindeerData.forEach(reindeer => {
        points[reindeer.name] = 0;
        distances[reindeer.name] = 0;
    });

    for (let second = 1; second <= totalTime; second++) {
        reindeerData.forEach(reindeer => {
            const { name, speed, flyTime, restTime } = reindeer;
            distances[name] = calculateDistance(speed, flyTime, restTime, second);
        });

        const maxDistance = Math.max(...Object.values(distances));
        reindeerData.forEach(reindeer => {
            if (distances[reindeer.name] === maxDistance) {
                points[reindeer.name]++;
            }
        });
    }

    let maxPoints = 0;
    let winningReindeer = '';

    for (const [name, point] of Object.entries(points)) {
        if (point > maxPoints) {
            maxPoints = point;
            winningReindeer = name;
        }
    }

    return { winningReindeer, maxPoints };
}

// Example usage:
const filePath = 'inputDay14.txt'; // Replace with the path to your text file
const reindeerData = parseReindeerData(filePath);
const totalTime = 2503;
const { winningReindeer, maxPoints } = findWinningReindeer(reindeerData, totalTime);
console.log('Winning Reindeer:', winningReindeer);
console.log('Max Points:', maxPoints);
