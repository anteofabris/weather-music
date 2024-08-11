import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const MapComponent = ({
  getWeatherData,
  incrementKeyCounter,
  stop,
  respread,
  rebuild,
}: {
  getWeatherData: any;
  incrementKeyCounter: any;
  stop: any;
  respread: any;
  rebuild: any;
}) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={async (e: any) => {
          stop();
          //  respread();
          await rebuild();
          await getWeatherData(e.detail.latLng.lat, e.detail.latLng.lng);
          await incrementKeyCounter();
          //   play();
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
