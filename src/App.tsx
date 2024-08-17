import * as Tone from "tone";
import {
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
  normalize,
} from "../extraction.ts";
import {
  makeChorus,
  makeAutoFilter,
  makeLimiter,
  makeAmpEnv,
  makeAutoPanner,
} from "../effects.ts";

import UserInterface from "./interface/index.tsx";
import { useState } from "react";

function makeOscillators(num: number, spread: number, container: any) {
  const obj: any = container ? container : {};
  for (let i = 0; i < num; i++) {
    obj[i] = new Tone.FatOscillator({
      volume: -20 - i * i,
      phase: 0,
      type: "triangle17",
      spread: spread,
    })
      .connect(
        new Tone.AmplitudeEnvelope({
          attack: 1,
          decay: 1,
          sustain: 1,
          release: 1,
        }).toDestination()
      )
      .toDestination();
  }
  return obj;
}

function makeSignals(num: number, container: any) {
  const obj: any = container ? container : {};
  for (let i = 0; i < num; i++) {
    obj[i] = new Tone.Signal();
  }
  return obj;
}

const firstPiano = makeOscillators(12, 1, null);
const firstSignals = makeSignals(12, null);
function App() {
  // SYNTH
  const [piano, setPiano] = useState(firstPiano);
  const [signals, setSignals] = useState(firstSignals);
  async function callSetPiano(uv: any) {
    for (let k in piano) {
      piano[k].disconnect().dispose();
      delete piano[k];
    }
    for (let k in signals) {
      signals[k].disconnect().dispose();
      delete signals[k];
    }
    console.log("UV: ", uv);
    const newPiano = makeOscillators(12, uv / 10, piano);
    const newSignals = makeSignals(12, signals);
    setPiano(newPiano);
    setSignals(newSignals);
    return;
  }

  return (
    <div>
      <UserInterface piano={piano} callSetPiano={callSetPiano} />
    </div>
  );
}

export default App;
