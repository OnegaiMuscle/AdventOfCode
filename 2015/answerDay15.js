function calculateScore(ingredients, amounts) {
  let capacity = 0;
  let durability = 0;
  let flavor = 0;
  let texture = 0;

  for (let i = 0; i < ingredients.length; i++) {
      capacity += ingredients[i].capacity * amounts[i];
      durability += ingredients[i].durability * amounts[i];
      flavor += ingredients[i].flavor * amounts[i];
      texture += ingredients[i].texture * amounts[i];
  }

  capacity = Math.max(0, capacity);
  durability = Math.max(0, durability);
  flavor = Math.max(0, flavor);
  texture = Math.max(0, texture);

  return capacity * durability * flavor * texture;
}

function findBestCookie(ingredients, totalTeaspoons) {
  let maxScore = 0;

  function recurse(amounts, index, remainingTeaspoons) {
      if (index === ingredients.length - 1) {
          amounts[index] = remainingTeaspoons;
          const score = calculateScore(ingredients, amounts);
          maxScore = Math.max(maxScore, score);
          return;
      }

      for (let i = 0; i <= remainingTeaspoons; i++) {
          amounts[index] = i;
          recurse(amounts, index + 1, remainingTeaspoons - i);
      }
  }

  recurse(new Array(ingredients.length).fill(0), 0, totalTeaspoons);
  return maxScore;
}

const fs = require('fs');

function parseIngredientData(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const ingredients = [];

    lines.forEach(line => {
        const parts = line.match(/(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/);
        if (parts) {
            const [_, name, capacity, durability, flavor, texture, calories] = parts;
            ingredients.push({
                name,
                capacity: parseInt(capacity),
                durability: parseInt(durability),
                flavor: parseInt(flavor),
                texture: parseInt(texture),
                calories: parseInt(calories)
            });
        }
    });

    return ingredients;
}

const filePath = 'inputDay15.txt'; // Replace with the path to your text file
const ingredients = parseIngredientData(filePath);
console.log(ingredients);


const totalTeaspoons = 100;
const bestScore = findBestCookie(ingredients, totalTeaspoons);
console.log('Best Score:', bestScore);
