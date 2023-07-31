import React, { useContext, useState, useEffect } from "react";
import WeatherContext from "../../services/weatherContext";
import { Link } from "react-router-dom";
import "./style/Dashboard.css";
import barbeque from "../../assets/icons/barbeque.png";
import {
  getWeatherIconUrl,
  extractHourFromDate,
  getDayNameFromDate,
  calculateBarbequeDayChances,
  getCurrentTimes,
} from "../../services/functions";
import TemperatureChart from "../Chart/TemperatureChart";
import NavBar from "../NavBar/NavBar";

function Dashboard() {
  const {
    forecast,
    handleSearch,
    location,
    setLocation,
    fetchWeatherForecast,
  } = useContext(WeatherContext);
  const [suggestedLocationsTimeNow, setSuggestedLocationsTimeNow] =
    useState(null);
  let currentLocation,
    currentTempCelsius,
    chanceOfRainToday,
    selectedHours,
    currentIcon,
    allForecastDays;
  let hourlyData = [];

  useEffect(() => {
    const fetchTimes = async () => {
      const locationsTime = await getCurrentTimes();
      setSuggestedLocationsTimeNow(locationsTime);
    };
    fetchTimes();
  }, []);

  const images = ["amsterdam", "barcelona", "london", "paris", "washington"];
  if (forecast) {
    currentLocation = forecast.location.name;
    currentTempCelsius = forecast.current.temp_c;
    chanceOfRainToday =
      forecast.forecast.forecastday[0].day.daily_chance_of_rain;
    currentIcon = getWeatherIconUrl(forecast.current.condition.text);
    selectedHours = forecast.forecast.forecastday[0].hour.filter(
      (hour, index) => [6, 9, 12, 15, 18, 21].includes(index)
    );
    allForecastDays = forecast.forecast.forecastday;
    hourlyData = forecast.forecast.forecastday[0].hour;
  }

  return (
    <div className="dashboard">
      <NavBar noFav={false} />
      <div className="forecast-container">
        <div className="search-bar-container">
          <div className="app-info">
            <h1>Weather Forecast</h1>
            <h3>Saturday 26, December 2020</h3>
          </div>
          <div className="search-bar">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search for cities..."
            />
            <button onClick={() => handleSearch(location)}>Search</button>
          </div>
        </div>

        <div className="weather-preview">
          <div className="preview-dates">
            <h2>{currentLocation}</h2>
            <p>Chances of rain {chanceOfRainToday}%</p>
            <h1>{currentTempCelsius}&deg;</h1>
          </div>
          {forecast ? (
            <div
              className="preview-icon"
              style={{ backgroundImage: `url(${currentIcon})` }}
            ></div>
          ) : (
            ""
          )}
        </div>

        <div className="today-forecast">
          <div className="title">TODAY'S FORECAST</div>
          <div className="today-hours-list">
            {selectedHours
              ? selectedHours.map((itm, index) => {
                  return (
                    <div key={index} className="hour-forecast">
                      <div className="hour">
                        {extractHourFromDate(itm.time)}
                      </div>
                      <div
                        className="icon"
                        style={{
                          backgroundImage: `url(${getWeatherIconUrl(
                            itm.condition.text
                          )})`,
                        }}
                      ></div>
                      <div className="degrees">{itm.temp_c}&deg;</div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        <div className="all-days-forecast">
          <div className="title">
            {forecast ? allForecastDays.length : ""} DAY FORECAST
          </div>
          <div className="day-forecast-container">
            {forecast
              ? allForecastDays.map((itm, index) => {
                  return (
                    <Link
                      key={itm.date}
                      to={`/day/${itm.date}`}
                      className="day-forecast"
                    >
                      <div className="hour">{getDayNameFromDate(itm.date)}</div>
                      <div className="day-forecast-extra">
                        <div className="name-forecast">
                          {itm.day.condition.text}
                        </div>
                        <div
                          className="icon"
                          style={{
                            backgroundImage: `url(${getWeatherIconUrl(
                              itm.day.condition.text
                            )})`,
                          }}
                        ></div>
                      </div>
                      <div className="barbeque">
                        <div className="barbeque-chances">
                          {calculateBarbequeDayChances(itm.day)}%
                        </div>
                        <div
                          className="barbeque-icon"
                          style={{ backgroundImage: `url(${barbeque})` }}
                        ></div>
                        <div className="degrees">{itm.day.avgtemp_c}&deg;</div>
                      </div>
                    </Link>
                  );
                })
              : ""}
          </div>
        </div>

        <TemperatureChart data={hourlyData} />
      </div>

      <div className="suggested-locations">
        {suggestedLocationsTimeNow
          ? images.map((itm, index) => {
              return (
                <div key={index}>
                  <img
                    src={require(`../../assets/images/${itm}.jpg`)}
                    alt=""
                    onClick={() => fetchWeatherForecast(itm)}
                  />
                  <p>
                    {suggestedLocationsTimeNow[itm] + " " + itm.toUpperCase()}
                  </p>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default Dashboard;
