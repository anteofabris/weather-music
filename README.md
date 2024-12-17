# Uplifting Weather Information

Click on a part of the map (land mass only - no ocean) and current weather information is collected, normalized and played on a synthesizer.

Each place has a unique identity given the current weather, which is realized as a moving chord. Its intervals, stability, and paralell motion are determined by values collected from the weather.

Hate finding out more bad news about our climate? Let the weather music app transport you to a distant place on its uplifting carpet of sound.

npm install
npm run dev

# Necessary Considerations

* A Google Maps API Key is required. Get one at https://developers.google.com/maps/documentation/embed/get-api-key and add it to your .env file as VITE_GOOGLE_MAPS_API_KEY={your-key}
* A Weather API key is required. Get one at https://www.weatherapi.com/ and add it to your .env file as VITE_WEATHER_API_KEY={your-key}
