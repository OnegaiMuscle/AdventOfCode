function simulateBattle(playerHP, playerMana, bossHP, bossDamage) {
  const spells = {
      MagicMissile: { cost: 53, damage: 4, heal: 0, armor: 0, duration: 0, mana: 0 },
      Drain: { cost: 73, damage: 2, heal: 2, armor: 0, duration: 0, mana: 0 },
      Shield: { cost: 113, damage: 0, heal: 0, armor: 7, duration: 6, mana: 0 },
      Poison: { cost: 173, damage: 3, heal: 0, armor: 0, duration: 6, mana: 0 },
      Recharge: { cost: 229, damage: 0, heal: 0, armor: 0, duration: 5, mana: 101 }
  };

  let minManaSpent = Infinity;

  function battle(playerHP, playerMana, bossHP, bossDamage, activeEffects, manaSpent, playerTurn) {
      if (manaSpent >= minManaSpent) return;

      // Apply active effects
      let armor = 0;
      for (let effect in activeEffects) {
          if (activeEffects[effect].duration > 0) {
              if (effect === "Shield") armor += spells[effect].armor;
              if (effect === "Poison") bossHP -= spells[effect].damage;
              if (effect === "Recharge") playerMana += spells[effect].mana;
              activeEffects[effect].duration--;
          }
      }

      // Check if boss is defeated
      if (bossHP <= 0) {
          minManaSpent = Math.min(minManaSpent, manaSpent);
          return;
      }

      // Check if player is defeated
      if (playerHP <= 0) return;

      if (playerTurn) {
          for (let spell in spells) {
              if (playerMana >= spells[spell].cost && (!activeEffects[spell] || activeEffects[spell].duration === 0)) {
                  let newActiveEffects = { ...activeEffects };
                  if (spells[spell].duration > 0) {
                      newActiveEffects[spell] = { duration: spells[spell].duration };
                  }
                  battle(
                      playerHP + spells[spell].heal,
                      playerMana - spells[spell].cost,
                      bossHP - spells[spell].damage,
                      bossDamage,
                      newActiveEffects,
                      manaSpent + spells[spell].cost,
                      false
                  );
              }
          }
      } else {
          playerHP -= Math.max(1, bossDamage - armor);
          if (playerHP > 0) {
              battle(playerHP, playerMana, bossHP, bossDamage, activeEffects, manaSpent, true);
          }
      }
  }

  battle(playerHP, playerMana, bossHP, bossDamage, {}, 0, true);
  return minManaSpent;
}

const playerHP = 50;
const playerMana = 500;
const bossHP = 58;
const bossDamage = 9;

console.log(simulateBattle(playerHP, playerMana, bossHP, bossDamage));
