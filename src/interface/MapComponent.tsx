import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const MapComponent = ({
  getWeatherData,
}: {
  getWeatherData: any;
}) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        // style={{ width: "100vw", height: "100vh" }}
        style={{ width: "70vw", height: "50vh" }}
        mapTypeId={"satellite"}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={5}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={async (e: any) => {
          await getWeatherData(e.detail.latLng.lat, e.detail.latLng.lng);
          console.log(
            "clicked: ",
            `${e.detail.latLng.lat},${e.detail.latLng.lng}`
          );
        }}
      />
    </APIProvider>
  );
};

export default MapComponent;
