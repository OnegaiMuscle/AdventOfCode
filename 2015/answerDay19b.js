const fs = require('fs');

let file = fs.readFileSync('inputDay19.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');
let target = file.pop();
file.pop();

let repl = file.map(x => x.split(' => '));

let z = 0;
while (target !== 'e') {
    for (let r of repl) {
        let pos = target.indexOf(r[1]);
        if (pos !== -1) {
            target = target.slice(0, pos) + r[0] + target.slice(pos + r[1].length);
            z++;
        }
    }
}

console.log(z)
