import { useEffect, useState } from "react";
import SecondsDial from "./SecondsDial";
import MapComponent from "./MapComponent";
import SynthComponent from "../SynthComponent";
import { testLocations } from "../../testForecast";
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
} from "../../extraction.ts";
import {
  makeChorus,
  makeAutoFilter,
  makeLimiter,
  makeAmpEnv,
  makeAutoPanner,
} from "../../effects.ts";
import * as Tone from "tone";
import Info from "./Info.tsx";

function UserInterface({
  piano,
  callSetPiano,
}: {
  piano: any;
  callSetPiano: any;
}) {
  const [seconds, setSeconds] = useState(3600);
  const [weatherData, setWeatherData] = useState(testLocations.medellin);
  const [dataReady, setDataReady] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  function incrementKeyCounter() {
    setKeyCounter(keyCounter + 1);
  }

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
  function play(seconds: number) {
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
        (piano as any)[k].set({ type: sineTypesArr[Number(k)] });

        // create a signal
        let signal = new Tone.Signal({
          value: allowedPitches[k],
          units: "frequency",
        }).connect((piano as any)[k].frequency);
        const partial = nearestFundamental * (k + 1);

        (piano as any)[k].start();
        signal.rampTo(partial, seconds, 0);
      }
    };
    // play all the oscillators
    console.log("PLAYING: ", piano);
    makeSound();
  }
  function stop() {
    for (let k in piano) {
      piano[k].sync().stop();
    }
  }
  function respread(weatherData: any) {
    const newSpread = weatherData.current.uv / 10;
    console.log(
      "spread numenator: ",
      weatherData.current.uv,
      weatherData.location.name,
      newSpread
    );
    for (let k in piano) {
      piano[k].spread = newSpread;
    }
  }

  // rebuild the synth
  async function rebuild(uv: number) {
    await callSetPiano(uv);
  }

  // WEATHER DATA
  async function getWeatherData(lat: any, lng: any) {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${lat},${lng}&aqi=yes&days=1&hour=1`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
      respread(data);
      stop();
      await rebuild(data.current.uv);
      if (!dataReady) setDataReady(true);
    } else {
      // load message
      console.log("oopsie");
    }
  }

  return (
    <div style={{ margin: "20px" }}>
      {!dataReady && <Info weatherData={null} />}
      {dataReady && <Info weatherData={weatherData} />}
      <SecondsDial seconds={seconds} setSeconds={setSeconds} />
      <MapComponent getWeatherData={getWeatherData} />
      {dataReady && <SynthComponent play={play} seconds={seconds} />}
    </div>
  );
}

export default UserInterface;
