// smallest unit of time is 16th note. 1 bar = length of 16

const normalize = (
  x: number,
  xRange: Array<number>,
  newRange: Array<number>
) => {
  const a = newRange[0];
  const b = newRange[1];
  const minX = xRange[0];
  const maxX = xRange[1];
  const res = a + ((x - minX) * (b - a)) / (maxX - minX); // normalization algorithm
  return res;
};

const getAttackLength = (humidity: number) => {
  // humidity typically ranges from 1% to 90%
  const humidityRange = [1, 90];
  // length of attack should be between 1 and 16 16th-notes
  const attackLengthRange = [1, 3];
  return normalize(humidity, humidityRange, attackLengthRange);
};
const getRatesOfAttack = (pressure_mb: number, rateFluctuation: number = 4) => {
  // air pressure in millibars ranges from 100 to 1050
  const airPressureRange = [100, 1050];
  // rate of attack should be between 1 and 35 16th-notes. 0 doesn't make any sense
  const rateOfAttackRange = [1, 7];
  const norm = normalize(pressure_mb, airPressureRange, rateOfAttackRange);
  // static value for now;
  const lowest = Math.abs(norm - rateFluctuation); // negative or 0 rates of attack value will break
  const res = [lowest || 1, norm, norm + rateFluctuation];
  console.log("rates of attac: ", res);
  return res;
};

const getPitchesPerHand = (uv: number) => {
  // uv index is 1-5,
  const uvRange = [1, 10];
  //ptiches per hand is 1-5 so
  const pitchRange = [1, 5];
  return normalize(uv, uvRange, pitchRange);
};
const getAllowedPitches = (precip_in: number) => {
  // precipitation usually ranges from 0 to 71.5 (world record)
  const precipRange = [0, 71.5];
  // allowed pitches will range from 5-note scale to 11-note scale
  const pitchRange = [27.5, 4680.1];
  return normalize(precip_in, precipRange, pitchRange);
};
const getMidpoint = (temp_f: number) => {
  // NOTE: convert to freq? or notes?
  // temp range will be from -20 to 120 farenheit
  const tempRange = [-20, 120];
  // midpoint should have room on either side of the piano
  const midpointRange = [27.5, 4186.01];
  // if temperature is extreme, we avoid negative values
  let temperature = temp_f;
  if (temp_f < -20) temperature = -20;

  return normalize(temperature, tempRange, midpointRange);
};

const getHandCycle = (temp_f: number) => {
  const tempRange = [-20, 120];
  const cycleLengthRange = [4, 80];
  let temperature = temp_f;
  if (temp_f < -20) temperature = Math.abs(temp_f + 20);
  return normalize(temperature, tempRange, cycleLengthRange);
};
const getMomentPhraseLength = (cloud: number) => {
  // cloud range is from 0 - 100
  const cloudRange = [0, 100];
  const phraseIndexRange = [0, 6];
  // return one value from [0, 5, 4, 3, 2 , 1], times sixteen
  return (
    [0, 5, 4, 3, 2, 1][
      Math.round(normalize(Math.abs(cloud), cloudRange, phraseIndexRange))
    ] * 16
  );
};
const getPhraseLength = (vis_miles: number) => {
  // visibility in miles ranges from 0 to 10
  const visRange = [0, 10];
  // phrase is from 2 beats to 128 beats - 1-beat phrase doesn't make sense.
  const phraseRange = [1, 128];
  return normalize(vis_miles, visRange, phraseRange);
};

const getChords = () => {};
const getRhythmicProfile = () => {
  // gets attack lengths and rate of attacks
  return;
  // returns an array of 2's 1's and 0's - 2 is a new attack, 1 is a sustain of previous index, 0 is a rest
};

const getPitchArrayDistribution = (
  midpoint: number,
  interval: number,
  numPitches: number
) => {
  // return an array of integers
  console.log("midpoint: ", midpoint);
  // take input n and operae with PI to spread values across spectrum
  const lh = [];
  const rh = [];
  for (let i = 0; i < numPitches; i++) {
    lh.push(midpoint / (Math.PI * (interval + i)) || 27.5);
    rh.push((midpoint + (interval + i) * Math.PI || 4680.1)/8)
  }
  console.log("pitcharray dist ", [...lh], numPitches);
  return [...lh];
};

export {
  normalize,
  getAttackLength,
  getRatesOfAttack,
  getPitchesPerHand,
  getAllowedPitches,
  getMidpoint,
  getHandCycle,
  getMomentPhraseLength,
  getPhraseLength,
  getChords,
  getRhythmicProfile,
  getPitchArrayDistribution,
};
