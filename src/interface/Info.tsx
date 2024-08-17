import React from "react";

const Info = ({ weatherData }: { weatherData: any }) => {
  return (
    <div className="box">
      <h2>Weather Information</h2>
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

export default Info;
