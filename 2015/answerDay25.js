function findCode(row, col) {
  let code = 20151125;
  const multiplier = 252533;
  const modulus = 33554393;

  // Calculate the position in the sequence
  let position = (row + col - 2) * (row + col - 1) / 2 + col;

  for (let i = 1; i < position; i++) {
      code = (code * multiplier) % modulus;
  }

  return code;
}

const row = 3010;
const col = 3019;
const code = findCode(row, col);
console.log(`The code at row ${row}, column ${col} is: ${code}`);
