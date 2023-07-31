import React, { useContext, useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./style/ExpandedDayCard.css";
import WeatherContext from "../../services/weatherContext";
import { useParams } from "react-router-dom";
import {
  getWeatherIconUrl,
  addToLocalStorage,
  formatDate,
  checkIfFavoriteExists,
  removeFromLocalStorage,
} from "../../services/functions";
import sunrise from "../../assets/icons/sunrise.png";
import sunset from "../../assets/icons/sunset.png";
import TemperatureChart from "../Chart/TemperatureChart";
import bookmarkBlack from "../../assets/icons/bookmark-black.png";
import bookmarkRed from "../../assets/icons/bookmark-red.png";
import { v4 as uuidv4 } from "uuid";

function ExpandedDayCard() {
  const { id } = useParams();
  const {
    forecast,
  } = useContext(WeatherContext);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [toggleFavoriteButton, setToggleFavoriteButton] = useState(
    checkIfFavoriteExists(id, forecast.location.name)
  );
  let hourlyData = [];

  let currentLocation,
    currentTempCelsius,
    chanceOfRainToday,
    currentIcon,
    detailsData;

  useEffect(() => {
    if (forecast) {
      const selectedForecastByDate = forecast.forecast.forecastday.find(
        (day) => day.date === id
      );
      setSelectedForecast(selectedForecastByDate);
    }
  }, [forecast]);

  if (forecast && selectedForecast) {
    currentLocation = forecast.location.name;
    currentTempCelsius = selectedForecast.day.avgtemp_c;
    chanceOfRainToday = selectedForecast.day.daily_chance_of_rain;
    currentIcon = getWeatherIconUrl(selectedForecast.day.condition.text);
    hourlyData = selectedForecast.hour;
    detailsData = [
      {
        name: "Humidity",
        value: selectedForecast.day.avghumidity,
        icon: require(`../../assets/icons/humidity.png`),
        unit: "%",
      },
      {
        name: "Visibility",
        value: selectedForecast.day.avgvis_km,
        icon: require(`../../assets/icons/visibility.png`),
        unit: "km",
      },
      {
        name: "Max. Wind Speed",
        value: selectedForecast.day.maxwind_kph,
        icon: require(`../../assets/icons/wind.png`),
        unit: "km/hour",
      },
      {
        name: "Precipitation",
        value: selectedForecast.day.totalprecip_mm,
        icon: require(`../../assets/icons/precipitation.png`),
        unit: "mm",
      },
      {
        name: "Snow",
        value: selectedForecast.day.totalsnow_cm,
        icon: require(`../../assets/icons/shovel.png`),
        unit: "cm",
      },
      {
        name: "UV Index",
        value: selectedForecast.day.uv,
        icon: require(`../../assets/icons/uv-index.png`),
        unit: "",
      },
      {
        name: "Moon illumination",
        value: selectedForecast.astro.moon_illumination,
        icon: require(`../../assets/icons/moon.png`),
        unit: "%",
      },
    ];
  }

  return (
    <div className="expanded-day-card">
      <NavBar noFav={false} />
      <div className="expanded-day-info-container">
        <div className="app-info">
          <h3>{selectedForecast ? formatDate(selectedForecast.date) : ""}</h3>
        </div>

        <button
          onClick={() => {
            setToggleFavoriteButton(!toggleFavoriteButton);
            if (toggleFavoriteButton) {
              removeFromLocalStorage(id, currentLocation);
            } else {
              addToLocalStorage({
                ...selectedForecast,
                location: forecast.location,
                uniqueIndex: uuidv4(),
              });
            }
          }}
          className="add-to-favorite"
        >
          <img
            src={toggleFavoriteButton ? bookmarkRed : bookmarkBlack}
            alt=""
          />
          <span>Add to favorite</span>
        </button>

        <div className="first-data-set">
          <div className="weather-preview">
            <div className="preview-dates">
              <h2>{currentLocation}</h2>
              <p>Chances of rain {chanceOfRainToday}%</p>
              <h1>{currentTempCelsius}&deg;</h1>
            </div>
            {forecast && selectedForecast ? (
              <div
                className="preview-icon"
                style={{ backgroundImage: `url(${currentIcon})` }}
              ></div>
            ) : (
              ""
            )}
          </div>
          <div className="astro">
            <div className="sunrise">
              <div className="sunrise-hour">
                {selectedForecast ? selectedForecast.astro.sunrise : ""}
              </div>
              <div className="sunrise-name">sunrise</div>
              <img src={sunrise} alt="" />
            </div>
            <div className="sunset">
              <div className="sunset-hour">
                {selectedForecast ? selectedForecast.astro.sunset : ""}
              </div>
              <div className="sunset-name">sunset</div>
              <img src={sunset} alt="" />
            </div>
          </div>
        </div>
        <div className="second-data-set">
          {forecast && selectedForecast
            ? detailsData.map((itm, index) => {
                return (
                  <div key={index} className="weather-details">
                    <div>
                      <p className="name-weather-details">{itm.name}</p>
                      <img src={itm.icon} alt="" />
                    </div>
                    <div className="detail-value">
                      {itm.value + " " + itm.unit}
                    </div>
                  </div>
                );
              })
            : ""}
        </div>

        <TemperatureChart data={hourlyData} />

        <div className="third-data-set">
          {forecast && selectedForecast
            ? selectedForecast.hour.map((itm, index) => {
                return (
                  <div key={index} className="hour-dates">
                    <div className="hour">{itm.time.split(" ")[1]}</div>
                    <div className="degrees">{itm.temp_c}&deg;</div>
                    <div className="forecast-dates">
                      <img src={getWeatherIconUrl(itm.condition.text)} alt="" />
                      <p>{itm.condition.text}</p>
                    </div>
                    <div className="humidity">
                      <img
                        src={require(`../../assets/icons/humidity.png`)}
                        alt=""
                      />
                      <p>{itm.humidity}</p>
                    </div>
                    <div className="wind-speed">
                      <img
                        src={require(`../../assets/icons/wind.png`)}
                        alt=""
                      />
                      <p>{itm.wind_kph}</p>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}

export default ExpandedDayCard;
