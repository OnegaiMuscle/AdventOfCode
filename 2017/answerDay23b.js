function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
  }
  return true;
}

function calculateH() {
  let h = 0;
  const bStart = 108400; // Start value for b
  const bEnd = 125400;   // End value for b
  const step = 17;       // Increment step for b

  for (let b = bStart; b <= bEnd; b += step) {
      if (!isPrime(b)) {
          h++; // Increment h for non-prime numbers
      }
  }

  return h;
}

// Main function
function main() {
  const hValue = calculateH();
  console.log(`The final value in register h is ${hValue}.`);
}

main();
