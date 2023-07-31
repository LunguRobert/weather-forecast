import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getWeatherForecast } from "./services/weatherAPI";
import Dashboard from "./components/Dashboard/Dashboard";
import ExpandedDayCard from "./components/ExpandedDayCard/ExpandedDayCard";
import FavoritesList from "./components/FavoritesList/FavoritesList";
import WeatherContext from "./services/weatherContext";
import "./App.css";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    fetchWeatherForecast(location);
  }, []);

  const handleSearch = () => {
    fetchWeatherForecast(location);
    setLocation("");
  };

  const fetchWeatherForecast = async (place) => {
    try {
      const forecast = await getWeatherForecast(place);
      setForecast(forecast);
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div className="App">
      <WeatherContext.Provider
        value={{
          forecast,
          location,
          setLocation,
          handleSearch,
          fetchWeatherForecast,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/day/:id" element={<ExpandedDayCard />} />
          <Route path="/favorites" element={<FavoritesList />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </WeatherContext.Provider>
    </div>
  );
}

export default App;
