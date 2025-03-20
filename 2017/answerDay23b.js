function run() {
  let h = 0;
  let b = 99;
  let c = b;
  b = b * 100;
  b = b + 100000;
  c = b + 17000;

  while (true) { // Loop E
      let f = 1;
      let d = 2;

      console.log(b, c, d, f, h);

      while (true) { // Loop B
          if (b % d === 0) {
              f = 0;
          }
          d = d + 1;
          if (d !== b) {
              continue;
          }
          if (f === 0) {
              h = h + 1;
          }
          if (b === c) {
              return h;
          }
          b = b + 17;
          break;
      }
  }
}

console.log(run());

