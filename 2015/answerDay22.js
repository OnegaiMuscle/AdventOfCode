function sim(actions, part) {
  let boss_hp = 55, boss_dmg = 8;
  let hp = 50, mana = 500, armor = 0;
  let turn = 0, turn_c = 0;
  let mana_spent = 0;
  let poison_left = 0, shield_left = 0, recharge_left = 0;
  let my_turn = 1;
  const spell_cost = {'M': 53, 'D': 73, 'S': 113, 'P': 173, 'R': 229};

  while (true) {
      if (actions.length - 1 < turn_c) {
          console.log('out of moves');
          return 0;
      }
      if (poison_left) {
          poison_left = Math.max(poison_left - 1, 0);
          boss_hp -= 3;
      }
      if (shield_left) {
          shield_left = Math.max(shield_left - 1, 0);
          armor = 7;
      } else {
          armor = 0;
      }
      if (recharge_left) {
          recharge_left = Math.max(recharge_left - 1, 0);
          mana += 101;
      }
      if (my_turn === 1) {
          if (part === 2) {
              hp -= 1;
              if (hp <= 0) {
                  return 0;
              }
          }
          const action = actions[turn_c];
          mana -= spell_cost[action];
          mana_spent += spell_cost[action];
          if (action === 'M') {
              boss_hp -= 4;
          } else if (action === 'D') {
              boss_hp -= 2;
              hp += 2;
          } else if (action === 'S') {
              if (shield_left) {
                  return 0;
              }
              shield_left = 6;
          } else if (action === 'P') {
              if (poison_left) {
                  return 0;
              }
              poison_left = 6;
          } else if (action === 'R') {
              if (recharge_left) {
                  return 0;
              }
              recharge_left = 5;
          }
          if (mana < 0) {
              return 0;
          }
      }
      if (boss_hp <= 0) {
          return mana_spent;
      }
      if (my_turn === -1) {
          hp -= Math.max(boss_dmg - armor, 1);
          if (hp <= 0) {
              return 0;
          }
      }
      if (my_turn === 1) {
          turn_c += 1;
      }
      my_turn = -my_turn;
      turn += 1;
  }
}

function iterate_actions(pos) {
  actions[pos] = 'DSPRM'['MDSPR'.indexOf(actions[pos])];
  if (actions[pos] === 'M') {
      if (pos + 1 <= actions.length) {
          iterate_actions(pos + 1);
      }
  }
}

for (let part of [1, 2]) {
  let actions = Array(20).fill('M');
  let min_spent = 1000000;
  for (let i = 0; i < 1000000; i++) {
      const result = sim(actions, part);
      if (result) {
          min_spent = Math.min(result, min_spent);
      }
      iterate_actions(0);
  }
  console.log(min_spent);
}
