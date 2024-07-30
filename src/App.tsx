import { useState, useEffect } from "react";
import * as Tone from "tone";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { brooklyn, medellin, zurich } from "../testForecast.ts";
import axios from "axios";
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
import "./App.css";
import { test } from "node:test";
// const autoFilter: any = new Tone.AutoFilter("4n").toDestination().start();
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

function makeMembraneSynths(num: number) {
  const obj: any = {};
  for (let i = 0; i < num; i++) {
    obj[i] = new Tone.MembraneSynth({
      // volume: -16 - i * i,
    }).toDestination();
  }
  return obj;
}
let oscillators = makeOscillators(12, 0.2);
function App() {
  Tone.Transport.start();
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
  const [dataFetched, setDataFetched] = useState(false); // IN TEST MODE? set to true
  const [data, setData] = useState(medellin);
  const [piano, setPiano] = useState(oscillators);
  const [membrane, setMembrane] = useState(makeMembraneSynths(12));
  const zipcodeObject = {
    greenland: "73.68733678413628,-44.23558510441544",
    calais: "50.974815073668026,1.8301347813956306",
    buenosAires: "-34.642396705532754,-58.415858874409174",
    honolulu: "21.45261234497537,-158.0207256321105",
    melbourne: "-37.823857668463525,144.93884988216476",
    flatiron: "40.741141726512836,-73.98947329056755",
    romanshorn: "47.566997219075674,9.3618152746456",
    tucson: "32.24521248020302,-110.96200948455281",
    zurich: "47.36005276342892,8.550020046147731",
    athensGreece: "37.973105059118026,23.72582305173767",
    lisbon: "38.74205040815735,-9.158257672851823",
    unicamp: "-22.81708446102991,-47.06976315462146",
    missoula: '46.87326889538417,-113.99859872564059',
    penicina: "44.80768485089671,9.340974847547246",
    dikoma: "-2.239655926016569,23.358729894245982",
    finke: '-25.582963962482815,134.5766010717347'
  };

  function getRandomInRange(from: number, to: number, fixed: number) {
    return (Math.random() * (to - from) + from).toFixed(fixed);
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
const longitude = getRandomInRange(-180, 180, 14)
const latitude = getRandomInRange(1, 89, 14)
const randomCoord: string = `${latitude},${longitude}`

  function getWeather() {
    console.log("current weather data: ", medellin);
    const options = {
      method: "GET",
      url: `http://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${zipcodeObject.dikoma}&aqi=yes&days=1&hour=1`,
    };

    if (!dataFetched)
      axios
        .request(options)
        .then((res) => {
          console.log("res", res.data);
          setDataFetched(true);
          setData(res.data);
          setPiano(makeOscillators(12, res.data.current.uv / 10));
        })
        .catch((err) => {
          console.log("err:", err);
          setDataFetched(true);
        });
    else console.log("test data; ", data);
  }

  function play() {
    const numPitches = 6;
    const midpoint = getMidpoint(data.current.temp_f);
    const interval = data.current.vis_miles || 1;
    const allowedPitches = getPitchArrayDistribution(
      midpoint,
      interval,
      numPitches
    );
    const loopTime = getRatesOfAttack(data.current.pressure_mb)[2];
    const nearestFundamental = Math.round(allowedPitches[0] / 10) * 10;
    const makeSound = () => {
      for (let k = 0; k < allowedPitches.length; k++) {
        // declare scope variables from data
        const filterFreq = normalize(
          data.current.precip_in,
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
        membrane[k].connect(makeLimiter(-20));

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
        const loop = new Tone.Loop(() => {
          console.log("in loop");
          signal.rampTo(allowedPitches[k], loopTime / 2, loopTime / 2);
        }, loopTime);

        // play the instrument
        Tone.Transport.start();
        (piano as any)[k].start();
        // loop.start(0);
        // signal.rampTo(partial, 10 , 0); // 10 second "performance"
        signal.rampTo(partial, 3600, 0);
      }
    };
    // play all the oscillators
    makeSound();
  }

  function stop() {
    for (let k in piano) {
      piano[k].sync().stop();
    }
  }

  return (
    <>
      <div className="card">
        <button onClick={() => getWeather()}>Get Weather</button>
        <button onClick={() => play()}>Play Weather</button>
        <button onClick={() => stop()}>Stop Weather</button>
      </div>
    </>
  );
}

export default App;

// const constant = allowedPitches[0]
// const nearestFundamental = Math.round(allowedPitches[0]/10) * 10

// const partial = nearestFundamental * (k+1)
