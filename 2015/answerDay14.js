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

// Example usage:
const filePath = 'inputDay14.txt'; // Replace with the path to your text file
const reindeerData = parseReindeerData(filePath);
console.log(reindeerData);

function calculateDistance(speed, flyTime, restTime, totalTime) {
  const cycleTime = flyTime + restTime;
  const fullCycles = Math.floor(totalTime / cycleTime);
  const remainingTime = totalTime % cycleTime;
  const flyingTime = fullCycles * flyTime + Math.min(remainingTime, flyTime);
  return flyingTime * speed;
}

function findWinningReindeer(reindeerData, totalTime) {
  let maxDistance = 0;
  let winningReindeer = '';

  reindeerData.forEach(reindeer => {
      const { name, speed, flyTime, restTime } = reindeer;
      const distance = calculateDistance(speed, flyTime, restTime, totalTime);
      if (distance > maxDistance) {
          maxDistance = distance;
          winningReindeer = name;
      }
  });

  return { winningReindeer, maxDistance };
}



const totalTime = 2503;
const { winningReindeer, maxDistance } = findWinningReindeer(reindeerData, totalTime);
console.log('Winning Reindeer:', winningReindeer);
console.log('Max Distance:', maxDistance);
