function findLowestHouse(targetPresents) {
  const presents = new Array(targetPresents / 10).fill(0);

  for (let elf = 1; elf < presents.length; elf++) {
      for (let house = elf, count = 0; house < presents.length && count < 50; house += elf, count++) {
          presents[house] += elf * 11;
      }
  }

  for (let house = 1; house < presents.length; house++) {
      if (presents[house] >= targetPresents) {
          return house;
      }
  }

  return -1; // If no house meets the target
}

// Example usage:
const targetPresents = 34000000;
const lowestHouse = findLowestHouse(targetPresents);
console.log('Lowest house number to get at least', targetPresents, 'presents:', lowestHouse);
