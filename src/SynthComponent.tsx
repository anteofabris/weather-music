import * as Tone from "tone";
import Button from "react-bootstrap/Button";
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
import { useEffect, useState } from "react";

function SynthComponent({
  seconds,
  weatherData,
  keyCounter,
}: {
  seconds: any;
  weatherData: any;
  keyCounter: any;
}) {
  console.log("trying to play: ");
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    return () => stop();
  }, keyCounter);
  const sineTypesArr = [
    "sine1",
    "sine2",
    "sine3",
    "sine4",
    "sine5",
    "sine6",
    "sine7",
    "sine8",
    "sine9",
    "sine10",
    "sine11",
    "sine12",
    "sine13",
    "sine14",
    "sine15",
    "sine16",
    "sine17",
    "sine18",
    "sine19",
    "sine20",
    "sine21",
    "sine22",
    "sine23",
    "sine24",
    "sine25",
    "sine26",
    "sine27",
    "sine28",
    "sine29",
    "sine30",
    "sine31",
    "sine32",
  ];
  function makeOscillators(num: number, spread: number) {
    const obj: any = {};
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
  let piano = makeOscillators(12, weatherData.current.uv / 10);

  function play() {
    // Tone.Destination.dispose()

    const numPitches = 6;
    const midpoint = getMidpoint(weatherData.current.temp_f);
    const interval = weatherData.current.vis_miles || 1;
    const allowedPitches = getPitchArrayDistribution(
      midpoint,
      interval,
      numPitches
    );
    const loopTime = getRatesOfAttack(weatherData.current.pressure_mb)[2];
    const nearestFundamental = Math.round(allowedPitches[0] / 10) * 10;
    const makeSound = () => {
      for (let k = 0; k < allowedPitches.length; k++) {
        // declare scope variables from weatherData
        const filterFreq = normalize(
          weatherData.current.precip_in,
          [71.5, 0],
          [27.5 * (k + 1), 4186.01 / (k + 1)]
        );
        // build options objects for effects
        console.log("filterfreq: ", filterFreq);
        const chorusOptions = {
          frequency: 0.17,
          delayTime: 2,
          depth: 0.1,
          wet: 0.1,
        };
        const autoFilterOptions = {
          frequency: 0.11,
        };
        const autoPanOptions = {
          frequency: 0.019 * k,
        };
        // connect effects
        (piano as any)[k].connect(makeChorus(chorusOptions));
        (piano as any)[k].connect(makeAutoFilter(autoFilterOptions));
        (piano as any)[k].connect(makeAutoPanner(autoPanOptions));
        (piano as any)[k].connect(makeLimiter(-20));
        // membrane[k].connect(makeLimiter(-20));

        // set oscillator params from data
        // piano[k].set({ frequency: allowedPitches[k as any] });
        (piano as any)[k].set({ type: sineTypesArr[Number(k)] });

        // create a signal
        const signal = new Tone.Signal({
          value: allowedPitches[k],
          units: "frequency",
        }).connect((piano as any)[k].frequency);

        // const partial = Math.round(allowedPitches[k] / 10) * 10;
        const partial = nearestFundamental * (k + 1);
        // build the loop

        // const loop = new Tone.Loop(() => {
        //   console.log("in loop");
        //   signal.rampTo(allowedPitches[k], loopTime / 2, loopTime / 2);
        // }, loopTime);

        // play the instrument
        Tone.Transport.start();
        (piano as any)[k].start();
        // loop.start(0);
        // signal.rampTo(partial, 10 , 0); // 10 second "performance"
        signal.rampTo(partial, seconds, 0);
      }
    };
    // play all the oscillators
    makeSound();
    setPlaying(true);
  }
  function stop() {
    for (let k in piano) {
      piano[k].sync().stop();
    }
    // update key
    // incrementKeyCounter();
  }

  function respread() {
    for (let k in piano) {
      piano[k].spread = weatherData.current.uv / 10;
    }
  }
  //   useEffect(() => play(), [weatherData]);
  play();

  return <div></div>;
}

export default SynthComponent;
