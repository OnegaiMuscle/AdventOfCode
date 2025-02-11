function josephus(numberOfElves) {
  let position = 0;
  for (let i = 1; i <= numberOfElves; i++) {
      position = (position + 2) % i;
  }
  return position + 1;
}

const numberOfElves = 3014387;
const winningElf = josephus(numberOfElves);
console.log(`The Elf that gets all the presents is: ${winningElf}`);

function findWinningElf(numberOfElves) {
  let power = 1;
  while (power * 3 < numberOfElves) {
      power *= 3;
  }

  const remaining = numberOfElves - power;
  if (remaining === 0) {
      return numberOfElves;
  }

  if (remaining <= power) {
      return remaining;
  } else {
      return power + remaining;
  }
}




const winningElfbis = findWinningElf(numberOfElves);
console.log(`The Elf that gets all the presents is: ${winningElfbis}`);
