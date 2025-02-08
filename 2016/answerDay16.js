// Function to generate the modified dragon curve data
function generateDragonCurveData(initialState, length) {
  let data = initialState;
  while (data.length < length) {
      let b = data.split('').reverse().map(char => char === '0' ? '1' : '0').join('');
      data = `${data}0${b}`;
  }
  return data.substring(0, length);
}

// Function to calculate the checksum
function calculateChecksum(data) {
  let checksum = data;
  while (checksum.length % 2 === 0) {
      let newChecksum = '';
      for (let i = 0; i < checksum.length; i += 2) {
          newChecksum += (checksum[i] === checksum[i + 1]) ? '1' : '0';
      }
      checksum = newChecksum;
  }
  return checksum;
}

// Puzzle input and required disk length
const initialState = '11110010111001001';
const diskLength = 272;

// Generate the data and calculate the checksum
const dragonCurveData = generateDragonCurveData(initialState, diskLength);
const checksum = calculateChecksum(dragonCurveData);

console.log(`The correct checksum for the disk is: ${checksum}`);


const diskLengthbis = 35651584;

// Generate the data and calculate the checksum
const dragonCurveDatabis = generateDragonCurveData(initialState, diskLengthbis);
const checksumbis = calculateChecksum(dragonCurveDatabis);

console.log(`The correct checksum for the disk is: ${checksumbis}`);
