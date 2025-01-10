const fs = require('fs');

function parseInstruction(instruction) {
    const parts = instruction.split(' ');
    if (parts.length === 3) {
        return { op: 'ASSIGN', src1: parts[0], dest: parts[2] };
    } else if (parts.length === 4) {
        return { op: 'NOT', src1: parts[1], dest: parts[3] };
    } else if (parts.length === 5) {
        return { op: parts[1], src1: parts[0], src2: parts[2], dest: parts[4] };
    }
}

function getValue(wires, src) {
    if (!isNaN(src)) {
        return parseInt(src, 10);
    }
    if (!(src in wires)) {
        throw new Error(`Wire ${src} has no signal`);
    }
    return wires[src];
}

function evaluateCircuit(instructions, override = {}) {
    const wires = { ...override };
    const pending = instructions.map(parseInstruction);

    while (pending.length > 0) {
        for (let i = 0; i < pending.length; i++) {
            const { op, src1, src2, dest } = pending[i];
            try {
                switch (op) {
                    case 'ASSIGN':
                        wires[dest] = getValue(wires, src1);
                        break;
                    case 'NOT':
                        wires[dest] = ~getValue(wires, src1) & 0xFFFF;
                        break;
                    case 'AND':
                        wires[dest] = getValue(wires, src1) & getValue(wires, src2);
                        break;
                    case 'OR':
                        wires[dest] = getValue(wires, src1) | getValue(wires, src2);
                        break;
                    case 'LSHIFT':
                        wires[dest] = getValue(wires, src1) << getValue(wires, src2);
                        break;
                    case 'RSHIFT':
                        wires[dest] = getValue(wires, src1) >> getValue(wires, src2);
                        break;
                }
                pending.splice(i, 1);
                i--;
            } catch (e) {
                // If there's an error, it means the wire's value is not ready yet
            }
        }
    }

    return wires;
}

const instructions = fs.readFileSync('inputDay07.txt', 'utf-8').trim().split('\n');
const initialWires = evaluateCircuit(instructions);
const signalA = initialWires['a'];

const override = { b: signalA };
const newWires = evaluateCircuit(instructions, override);

console.log(newWires['a']); // Output: new signal for wire 'a'
