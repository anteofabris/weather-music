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

const firstPiano = makeOscillators(12, 1, null);

function App() {
  // SYNTH
  const [piano, setPiano] = useState(firstPiano);
    // let piano = makeOscillators(12, 1, null);
  function callSetPiano(uv: any) {
    for (let k in piano) {
        piano[k].disconnect().dispose();    
        delete piano[k]
        // Tone.Transport.unsyncSignal(piano[k]).clear(piano[k])

        // piano[k].spread = (uv ? uv : 10) / 10
    }
    const newPiano = makeOscillators(12, (uv ? uv : 10) / 10, piano);
    return setPiano(newPiano);
  }

  return (
    <div>
      <UserInterface piano={piano} callSetPiano={callSetPiano} />
    </div>
  );
}

export default App;
