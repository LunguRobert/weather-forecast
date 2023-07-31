import axios from "axios";
import API_KEY from "./config";

export const getWeatherForecast = async (location) => {
  let finalLocation = "Bucuresti";
  if (location !== "") {
    finalLocation = location;
  }
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${finalLocation}&days=7&aqi=yes&alerts=no`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};
