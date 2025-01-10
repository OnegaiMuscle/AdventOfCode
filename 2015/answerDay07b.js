const fs = require('fs');

let wires = {};

function Wire(instruction) {
    this.calculate = this.generateValueGetter(instruction);
}

Wire.prototype.getValue = function() {
    if (this.value === undefined) {
        this.value = this.checkRange(this.calculate());
    }
    return this.value;
};

Wire.prototype.checkRange = function(i) {
    const n = 65536;
    return ((i % n) + n) % n;
};

Wire.prototype.generateValueGetter = function(instruction) {
    let assignMatch, opMatch;

    if (assignMatch = /^(NOT )?([0-9]+|[a-z]+)$/.exec(instruction)) {
        return function() {
            let value = parseValue(assignMatch[2]);
            if (assignMatch[1]) value = ~value;
            return value;
        };
    } else if (opMatch = /^([a-z]+|[0-9]+) (AND|OR|LSHIFT|RSHIFT) ([a-z]+|[0-9]+)$/.exec(instruction)) {
        const opCode = this.ops[opMatch[2]];
        return function() {
            return eval(parseValue(opMatch[1]) + ' ' + opCode + ' ' + parseValue(opMatch[3]));
        };
    }
};

Wire.prototype.ops = {
    'AND': '&',
    'OR': '|',
    'LSHIFT': '<<',
    'RSHIFT': '>>',
};

function parseValue(key) {
    const i = parseInt(key);
    return !isNaN(i) ? i : wires[key].getValue();
}

fs.readFile('inputDay07.txt', 'utf8', (err, data) => {
    if (err) throw err;

    data.split('\n').forEach(function(item) {
        let match;
        if (match = /(.*) -> ([a-z]+)/.exec(item)) {
            wires[match[2]] = new Wire(match[1]);
        }
    });

    const partOne = wires.a.getValue();
    console.log('Part One:', partOne);

    Object.keys(wires).forEach(function(key) {
        wires[key].value = undefined;
    });
    wires.b.value = partOne;

    console.log('Part Two:', wires.a.getValue());
});
