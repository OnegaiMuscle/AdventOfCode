const fs = require('fs');

function parseData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data.trim().split('\n');
}

function processInstructions(instructions) {
    const bots = {};
    const outputs = {};
    const valueInstructions = [];
    const botInstructions = [];

    instructions.forEach(instruction => {
        if (instruction.startsWith('value')) {
            valueInstructions.push(instruction);
        } else {
            botInstructions.push(instruction);
        }
    });

    valueInstructions.forEach(instruction => {
        const [, value, , , , bot] = instruction.split(' ');
        if (!bots[bot]) {
            bots[bot] = [];
        }
        bots[bot].push(parseInt(value, 10));
    });

    while (botInstructions.length > 0) {
        for (let i = 0; i < botInstructions.length; i++) {
            const instruction = botInstructions[i];
            const [, bot, , , lowType, lowDest, , , , highType, highDest] = instruction.split(' ');

            if (bots[bot] && bots[bot].length === 2) {
                const [low, high] = bots[bot].sort((a, b) => a - b);

                if (low === 17 && high === 61) {
                    return bot;
                }

                if (lowType === 'bot') {
                    if (!bots[lowDest]) {
                        bots[lowDest] = [];
                    }
                    bots[lowDest].push(low);
                } else {
                    if (!outputs[lowDest]) {
                        outputs[lowDest] = [];
                    }
                    outputs[lowDest].push(low);
                }

                if (highType === 'bot') {
                    if (!bots[highDest]) {
                        bots[highDest] = [];
                    }
                    bots[highDest].push(high);
                } else {
                    if (!outputs[highDest]) {
                        outputs[highDest] = [];
                    }
                    outputs[highDest].push(high);
                }

                botInstructions.splice(i, 1);
                i--;
            }
        }
    }

    return null;
}

const instructions = parseData('inputDay10.txt');
const responsibleBot = processInstructions(instructions);
console.log(`The bot responsible for comparing value-61 microchips with value-17 microchips is: ${responsibleBot}`);
