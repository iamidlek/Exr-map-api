import { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import {
  getPlacesData,
  getWeatherData,
  WeatherData,
} from "./api/travelAdvisorAPI";
import googleMapReact from "google-map-react";

export interface place {
  rating: string;
  name: string;
  num_reviews: string;
  price_level: string;
  ranking: string;
  awards: {
    images: { small: string };
    display_name: string;
  }[];
  cuisine: { key: string; name: string }[];
  address: string;
  phone: string;
  web_url: string;
  website: string;
  photo: { images: { large: { url: string } } };
}
export interface Bounds {
  ne: googleMapReact.Coords;
  sw: googleMapReact.Coords;
}

export interface coord {
  lat: number;
  lng: number;
}

function App() {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  const [coords, setCoords] = useState<coord>({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState<Bounds>();

  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [filteredPlaces, setFilteredPlaces] = useState<place[]>([]);
  const [places, setPlaces] = useState<place[]>([]);

  const [childClicked, setChildClicked] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filtered = places.filter((place) => place.rating > rating);

    setFilteredPlaces(filtered);
  }, [rating]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      if (coords) {
        getWeatherData(coords.lat, coords.lng).then((data) =>
          setWeatherData(data)
        );
      }

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        if (data) {
          setPlaces(
            data.filter((place) => place.name && Number(place.num_reviews) > 0)
          );
        }
        setFilteredPlaces([]);
        setRating("");
        setIsLoading(false);
      });
    }
  }, [bounds, type]);
  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete?.getPlace()?.geometry?.location?.lat();
    const lng = autocomplete?.getPlace()?.geometry?.location?.lng();
    if (lat && lng) {
      setCoords({ lat, lng });
    }
  };
  console.log(autocomplete);
  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
