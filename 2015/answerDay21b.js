function calculateDamage(attackerDamage, defenderArmor) {
  return Math.max(1, attackerDamage - defenderArmor);
}

function simulateBattle(player, boss) {
  while (true) {
      boss.hitPoints -= calculateDamage(player.damage, boss.armor);
      if (boss.hitPoints <= 0) return true;
      player.hitPoints -= calculateDamage(boss.damage, player.armor);
      if (player.hitPoints <= 0) return false;
  }
}

function getMaximumGoldToLose(boss) {
  const weapons = [
      { cost: 8, damage: 4, armor: 0 },
      { cost: 10, damage: 5, armor: 0 },
      { cost: 25, damage: 6, armor: 0 },
      { cost: 40, damage: 7, armor: 0 },
      { cost: 74, damage: 8, armor: 0 }
  ];

  const armors = [
      { cost: 0, damage: 0, armor: 0 },
      { cost: 13, damage: 0, armor: 1 },
      { cost: 31, damage: 0, armor: 2 },
      { cost: 53, damage: 0, armor: 3 },
      { cost: 75, damage: 0, armor: 4 },
      { cost: 102, damage: 0, armor: 5 }
  ];

  const rings = [
      { cost: 0, damage: 0, armor: 0 },
      { cost: 25, damage: 1, armor: 0 },
      { cost: 50, damage: 2, armor: 0 },
      { cost: 100, damage: 3, armor: 0 },
      { cost: 20, damage: 0, armor: 1 },
      { cost: 40, damage: 0, armor: 2 },
      { cost: 80, damage: 0, armor: 3 }
  ];

  let maxGold = 0;

  for (let weapon of weapons) {
      for (let armor of armors) {
          for (let ring1 of rings) {
              for (let ring2 of rings) {
                  if (ring1 === ring2 && ring1.cost !== 0) continue;

                  const player = {
                      hitPoints: 100,
                      damage: weapon.damage + ring1.damage + ring2.damage,
                      armor: armor.armor + ring1.armor + ring2.armor
                  };

                  const totalCost = weapon.cost + armor.cost + ring1.cost + ring2.cost;

                  if (!simulateBattle(player, { ...boss })) {
                      maxGold = Math.max(maxGold, totalCost);
                  }
              }
          }
      }
  }

  return maxGold;
}

const boss = {
  hitPoints: 109,
  damage: 8,
  armor: 2
};

console.log(getMaximumGoldToLose(boss));
