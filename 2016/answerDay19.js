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
