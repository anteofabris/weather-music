import React from "react";

const Info = ({ weatherData }: { weatherData: any }) => {
  if (!weatherData)
    return (
      <div className="box">
        <h2>Weather-Derived Sonic Bath (Rising Frequency Architecture)</h2>
        <p>
          Location:{" "}
          <i>
            <small>choose a location on the map to begin</small>
          </i>
        </p>
        <p>Latitude:</p>
        <p>Longitude:</p>
        <p>Temperature:</p>
        <p>Humidity:</p>
        <p>UV Index:</p>
      </div>
    );
  return (
    <div className="box">
      <h2>Weather-Derived Sonic Bath (Rising Frequency Architecture)</h2>
      <p>
        Location: {weatherData.location.name}; {weatherData.location.region},{" "}
        {weatherData.location.country}
      </p>
      <p>Latitude: {weatherData.location.lat}</p>
      <p>Longitude: {weatherData.location.lon}</p>
      <p>Temperature: {weatherData.current.temp_c}°C</p>
      <p>Humidity: {weatherData.current.humidity}%</p>
      <p>UV Index: {weatherData.current.uv}</p>
    </div>
  );
};

// save bath
// 

export default Info;
