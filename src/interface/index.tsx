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

function UserInterface({
  piano,
  callSetPiano,
}: {
  piano: any;
  callSetPiano: any;
}) {
  // google maps api
  // seconds dial

  // <UserPlaySurface/>
  // <SecondsDial/>
  // <Info/>
  // <MapComponent/>
  // <GenerationButton/>
  //
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
      console.log("makiung sound: ", piano);
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
      piano[k].spread =
        (weatherData ? (weatherData as any).current.uv : 10) / 10;
    }
  }

  // rebuild the synth
  async function rebuild() {
    // for (let k in piano) {
    //   delete piano[k];
    // }
    await callSetPiano((weatherData as any).current.uv);
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
      stop();
      await rebuild();
      if (!dataReady) setDataReady(true);
    } else {
      // load message
      console.log("oopsie");
    }
  }

  return (
    <>
      <SecondsDial setSeconds={setSeconds} value={seconds} />
      {/* <Info /> */}
      <MapComponent
        getWeatherData={getWeatherData}
        incrementKeyCounter={incrementKeyCounter}
        stop={stop}
        respread={respread}
        rebuild={rebuild}
      />
      {dataReady && (
        <SynthComponent
          play={play}
          seconds={seconds}
          key={keyCounter}
          keyCounter={keyCounter}
          weatherData={weatherData}
        />
      )}
    </>
  );
}

export default UserInterface;
