import axios from "axios";
import googleMapReact from "google-map-react";
import { place } from "../App";

export const getPlacesData = async (
  type: string,
  sw: googleMapReact.Coords,
  ne: googleMapReact.Coords
) => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: place[] }>(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_latitude: ne.lat,
          tr_longitude: ne.lng,
        },
        headers: {
          "x-rapidapi-key": `${process.env.REACT_APP_RAPID_API_TRAVEL_API_KEY}`,
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export interface WeatherData {
  list: {
    weather: { icon: string }[];
  }[];
}

export const getWeatherData = async (
  lat?: number | (() => number),
  lng?: number | (() => number)
) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get<WeatherData>(
        "https://community-open-weather-map.p.rapidapi.com/find",
        {
          params: { lat, lon: lng },
          headers: {
            "x-rapidapi-key": `${process.env.REACT_APP_RAPID_API_WEATHER_API_KEY}`,
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
          },
        }
      );

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
