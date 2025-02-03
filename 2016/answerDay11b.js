class ElementRTGComponents {
  constructor(element, gen_floor, mic_floor) {
      this.element = element;
      this.gen_floor = gen_floor;
      this.mic_floor = mic_floor;
  }
}

function parseComponents(str) {
  let floor = 0;
  let comps = [];
  const lines = str.split('\n');
  for (let s of lines) {
      floor += 1;
      if (s.includes("contains nothing relevant")) {
          continue;
      }

      const match = s.match(/The [a-z]* floor contains/);
      const components = s.slice(match[0].length).split(/, a |,* and a /);
      for (let component of components) {
          const m = component.match(/([a-z]+)(?:( generator)|(\-compatible microchip))/);
          const element = m[1];
          const existing = comps.find(comp => comp.element === element);
          if (m[2]) {
              if (existing) {
                  existing.gen_floor = floor;
              } else {
                  comps.push(new ElementRTGComponents(element, floor, -1));
              }
          } else {
              if (existing) {
                  existing.mic_floor = floor;
              } else {
                  comps.push(new ElementRTGComponents(element, -1, floor));
              }
          }
      }
  }
  return comps;
}

function solveComps(comps) {
  let itemsPerFloor = [0, 0, 0, 0];
  const itemCount = comps.length * 2;

  for (let comp of comps) {
      itemsPerFloor[comp.gen_floor - 1] += 1;
      itemsPerFloor[comp.mic_floor - 1] += 1;
  }

  // Analysis presents 2 * n - 3 as the number of moves to move up a floor
  let moves = 0;
  let floor = 0;
  while (itemsPerFloor[3] !== itemCount) {
      moves += 2 * itemsPerFloor[floor] - 3;
      itemsPerFloor[floor + 1] += itemsPerFloor[floor];
      itemsPerFloor[floor] = 0;
      floor += 1;
  }

  return moves;
}

function aoc_11b(input) {
  let comps = parseComponents(input);
  comps.push(new ElementRTGComponents("elerium", 1, 1));
  comps.push(new ElementRTGComponents("dilithium", 1, 1));
  return solveComps(comps);
}

// Example usage
const input = `The first floor contains a polonium generator, a thulium generator, a thulium-compatible microchip, a promethium generator, a ruthenium generator, a ruthenium-compatible microchip, a cobalt generator, and a cobalt-compatible microchip.
The second floor contains a polonium-compatible microchip and a promethium-compatible microchip.
The third floor contains nothing relevant.
The fourth floor contains nothing relevant.`;

console.log(aoc_11b(input));
