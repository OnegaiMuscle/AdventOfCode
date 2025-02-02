const fs = require('fs');

function gi(reg, s) {
    return s.match(reg).slice(1).map(Number);
}

function gm(reg, s) {
    return s.match(reg).slice(1);
}

const data = fs.readFileSync('inputDay10.txt', 'utf-8').trim().split('\n');

const bots = {};
const rules = {};
const outputs = {};

function ins(x, k, v) {
    if (!x[k]) {
        x[k] = [];
    }
    x[k] = x[k].concat(v).sort((a, b) => a - b);
}

data.forEach(line => {
    try {
        const [bot, dlow, low, dhigh, high] = gm(/bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)/, line);
        const botNum = parseInt(bot, 10);
        const lowNum = parseInt(low, 10);
        const highNum = parseInt(high, 10);
        rules[botNum] = [dlow, lowNum, dhigh, highNum];
    } catch (e) {
        // Ignore errors
    }
    try {
        const [value, bot] = gi(/value (\d+) goes to bot (\d+)/, line);
        ins(bots, bot, value);
    } catch (e) {
        // Ignore errors
    }
});

let botsWithTwo = Object.keys(bots).filter(b => bots[b].length === 2).length;

const ds = { 'output': outputs, 'bot': bots };
while (botsWithTwo > 0) {
    const bot = Object.keys(bots).find(b => bots[b].length === 2);
    const [dlow, low, dhigh, high] = rules[bot];
    const [lv, hv] = bots[bot];
    if (lv === 17 && hv === 61) {
        console.log("part a", bot);
    }
    ins(ds[dlow], low, lv);
    ins(ds[dhigh], high, hv);
    bots[bot] = [];
    botsWithTwo = Object.keys(bots).filter(b => bots[b].length === 2).length;
}

console.log("part b", outputs[0][0] * outputs[1][0] * outputs[2][0]);
 