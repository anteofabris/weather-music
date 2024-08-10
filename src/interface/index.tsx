import { useEffect, useState } from "react";
import SecondsDial from "./SecondsDial";
import MapComponent from "./MapComponent";
import SynthComponent from "../SynthComponent";
import { testLocations } from "../../testForecast";
import * as Tone from "tone";

function UserInterface(props: any) {
  // google maps api
  // seconds dial

  // <UserPlaySurface/>
  // <SecondsDial/>
  // <Info/>
  // <MapComponent/>
  // <GenerationButton/>
  //
  const [seconds, setSeconds] = useState(3600);
  const [weatherData, setWeatherData] = useState(null);
  const [keyCounter, setKeyCounter] = useState(0);
  function incrementKeyCounter() {
    setKeyCounter(keyCounter + 1);
  }

  async function getWeatherData(lat: any, lng: any) {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${lat},${lng}&aqi=yes&days=1&hour=1`
    );
    const data = await response.json();
    console.log(data);
    setWeatherData(data);
  }

  return (
    <>
      <SecondsDial setSeconds={setSeconds} value={seconds} />
      {/* <Info /> */}
      <MapComponent
        getWeatherData={getWeatherData}
        incrementKeyCounter={incrementKeyCounter}
      />
      {weatherData && (
        <SynthComponent
          seconds={seconds}
          weatherData={weatherData}
          key={keyCounter}
          keyCounter={keyCounter}
        />
      )}
    </>
  );
}

export default UserInterface;
