import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./style/FavoritesList.css";
import {
  getWeatherIconUrl,
  calculateBarbequeDayChances,
  getFavoritesFromLocalStorage,
  formatDate,
  updateFavoritesInLocalStorage,
} from "../../services/functions";
import sunset from "../../assets/icons/sunset.png";
import sunrise from "../../assets/icons/sunrise.png";

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);

  const removeItem = (uniqueIndex) => {
    const updatedFavorites = favorites.filter(
      (itm) => itm.uniqueIndex !== uniqueIndex
    );
    setFavorites(updatedFavorites);
    updateFavoritesInLocalStorage(updatedFavorites);
  };

  useEffect(() => {
    const favoritesData = getFavoritesFromLocalStorage();
    setFavorites(favoritesData);
  }, []);

  return (
    <div className="favorites">
      <NavBar noFav={true} />
      <div className="favorites-list">
        <h1>Favorites days</h1>
        {favorites.map((itm, index) => {
          return (
            <div key={itm.uniqueIndex} className="favorite-day">
              <button
                className="remove-button"
                onClick={() => removeItem(itm.uniqueIndex)}
              >
                Remove
              </button>
              <div className="location-date">
                {itm.location.name +
                  "/" +
                  itm.location.country +
                  " | " +
                  formatDate(itm.date)}
              </div>
              <div className="info-preview">
                <div className="first-info-preview">
                  {itm.day.avgtemp_c}&deg;{" "}
                  <img src={getWeatherIconUrl(itm.day.condition.text)} alt="" />
                </div>
                <div className="second-info-preview">
                  <div className="precipitation">
                    <img
                      src={require(`../../assets/icons/precipitation.png`)}
                      alt=""
                    />{" "}
                    {itm.day.avghumidity}%
                  </div>
                  <div className="wind-speed">
                    <img src={require(`../../assets/icons/wind.png`)} alt="" />{" "}
                    {itm.day.maxwind_kph} km/h
                  </div>
                </div>
              </div>
              <p className="description">
                {itm.day.condition.text +
                  ". The maximum temperature " +
                  itm.day.maxtemp_c}
                &deg;.{" "}
                {"There is a " +
                  calculateBarbequeDayChances(itm.day) +
                  "% chance of making a barbecue today"}
              </p>
              <table className="more-data">
                <tbody>
                  <tr>
                    <td>
                      <img
                        src={require(`../../assets/icons/humidity.png`)}
                        alt=""
                      />
                      <div className="humidity">
                        <p>Umiditate</p>
                        <p>{itm.day.avghumidity}%</p>
                      </div>
                    </td>
                    <td>
                      <img
                        src={require(`../../assets/icons/uv-index.png`)}
                        alt=""
                      />
                      <div className="humidity">
                        <p>UV index</p>
                        <p>{itm.day.uv}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={sunrise} alt="" />
                      <div className="humidity">
                        <p>Sunrise</p>
                        <p>{itm.astro.sunrise}</p>
                      </div>
                    </td>
                    <td>
                      <img src={sunset} alt="" />
                      <div className="humidity">
                        <p>Sunset</p>
                        <p>{itm.astro.sunset}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesList;
