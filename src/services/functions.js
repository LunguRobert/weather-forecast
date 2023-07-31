const weatherIcons = {
  Sunny: require("../assets/icons/sunny.png"),
  "Partly cloudy": require("../assets/icons/partly-cloudy.png"),
  Cloudy: require("../assets/icons/cloudy.png"),
  Overcast: require("../assets/icons/overcast.png"),
  Mist: require("../assets/icons/mist.png"),
  "Patchy rain possible": require("../assets/icons/overcast.png"),
  "Patchy snow possible": require("../assets/icons/overcast.png"),
  "Patchy sleet possible": require("../assets/icons/snow-rain.png"),
  "Patchy freezing drizzle possible": require("../assets/icons/snow-rain.png"),
  "Thundery outbreaks possible": require("../assets/icons/overcast.png"),
  "Blowing snow": require("../assets/icons/snow-storm.png"),
  Blizzard: require("../assets/icons/snow-storm.png"),
  Fog: require("../assets/icons/fog.png"),
  "Freezing fog": require("../assets/icons/fog.png"),
  "Patchy light drizzle": require("../assets/icons/snow-rain.png"),
  "Light drizzle": require("../assets/icons/snow-rain.png"),
  "Freezing drizzle": require("../assets/icons/snow-rain.png"),
  "Heavy freezing drizzle": require("../assets/icons/snow-rain.png"),
  "Patchy light rain": require("../assets/icons/rain.png"),
  "Light rain": require("../assets/icons/rain.png"),
  "Moderate rain at times": require("../assets/icons/rain.png"),
  "Moderate rain": require("../assets/icons/rain.png"),
  "Heavy rain at times": require("../assets/icons/heavy-rain.png"),
  "Heavy rain": require("../assets/icons/heavy-rain.png"),
  "Light freezing rain": require("../assets/icons/snow-rain.png"),
  "Moderate or heavy freezing rain": require("../assets/icons/snow-rain.png"),
  "Light sleet": require("../assets/icons/snow-rain.png"),
  "Moderate or heavy sleet": require("../assets/icons/snow-rain.png"),
  "Patchy light snow": require("../assets/icons/snow.png"),
  "Light snow": require("../assets/icons/snow.png"),
  "Patchy moderate snow": require("../assets/icons/snow.png"),
  "Moderate snow": require("../assets/icons/snow.png"),
  "Patchy heavy snow": require("../assets/icons/snow.png"),
  "Heavy snow": require("../assets/icons/snow.png"),
  "Ice pellets": require("../assets/icons/snow.png"),
  "Light rain shower": require("../assets/icons/rain-shower.png"),
  "Moderate or heavy rain shower": require("../assets/icons/rain-shower.png"),
  "Torrential rain shower": require("../assets/icons/rain-shower.png"),
  "Light sleet showers": require("../assets/icons/snow-rain.png"),
  "Moderate or heavy sleet showers": require("../assets/icons/snow-rain.png"),
  "Light snow showers": require("../assets/icons/snow-rain.png"),
  "Moderate or heavy snow showers": require("../assets/icons/snow-rain.png"),
  "Light showers of ice pellets": require("../assets/icons/snow-rain.png"),
  "Moderate or heavy showers of ice pellets": require("../assets/icons/snow-rain.png"),
  "Patchy light rain with thunder": require("../assets/icons/thunderstorm.png"),
  "Moderate or heavy rain with thunder": require("../assets/icons/thunderstorm.png"),
  "Patchy light snow with thunder": require("../assets/icons/thunderstorm.png"),
  "Moderate or heavy snow with thunder": require("../assets/icons/thunderstorm.png"),
  Clear: require("../assets/icons/clear.png"),
};

export const getWeatherIconUrl = (weatherString) => {
  const defaultIconUrl = "../assets/icons/weather-news.png";

  if (weatherString in weatherIcons) {
    return weatherIcons[weatherString];
  } else {
    return defaultIconUrl;
  }
};

export const extractHourFromDate = (dateTimeString) =>
  dateTimeString.slice(dateTimeString.indexOf(" ") + 1);

export const getDayNameFromDate = (dateTimeString) => {
  const dateObject = new Date(dateTimeString);
  const currentDate = new Date();
  const options = { weekday: "long" };

  if (dateObject.toDateString() === currentDate.toDateString()) {
    return "Today";
  } else {
    return dateObject.toLocaleDateString("en-US", options);
  }
};

export const calculateBarbequeDayChances = (weatherData) => {
  const {
    avghumidity,
    avgtemp_c,
    daily_chance_of_rain,
    daily_chance_of_snow,
    maxwind_kph,
    maxwind_mph,
    totalsnow_cm,
  } = weatherData;

  let barbequeChance = 0;

  if (avgtemp_c >= 20 && avgtemp_c <= 30) {
    barbequeChance += 50;
  }

  if (avghumidity <= 50) {
    barbequeChance += 20;
  }

  if (daily_chance_of_rain === 0 && daily_chance_of_snow === 0) {
    barbequeChance += 30;
  }

  if (maxwind_kph <= 20 && maxwind_mph <= 13) {
    barbequeChance += 10;
  }

  if (totalsnow_cm === 0) {
    barbequeChance += 10;
  }

  barbequeChance = Math.min(barbequeChance, 100);

  return barbequeChance;
};

const getLocalTime = async (city) => {
  try {
    const response = await fetch(
      `http://worldtimeapi.org/api/timezone/${city}`
    );
    const data = await response.json();
    const dateTime = data.datetime;
    const time = dateTime.split("T")[1].substring(0, 5);
    return time;
  } catch (error) {
    console.error("Error fetching local time:", error);
    return null;
  }
};

export const getCurrentTimes = async () => {
  const londonTime = await getLocalTime("Europe/London");
  const amsterdamTime = await getLocalTime("Europe/Amsterdam");
  const washingtonTime = await getLocalTime("America/New_York");
  const parisTime = await getLocalTime("Europe/Paris");
  const barcelonaTime = await getLocalTime("Europe/Madrid");

  return {
    london: londonTime,
    amsterdam: amsterdamTime,
    washington: washingtonTime,
    paris: parisTime,
    barcelona: barcelonaTime,
  };
};

export const formatDate = (dateStr) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateStr);
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${dayOfMonth}, ${month} ${year}`;
};

export const addToLocalStorage = (item) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const existingItems = JSON.parse(localStorage.getItem("favorites")) || [];
      existingItems.push(item);
      localStorage.setItem("favorites", JSON.stringify(existingItems));

      return true;
    } catch (error) {
      console.error("Eroare la adăugarea în LocalStorage: ", error);
      return false;
    }
  } else {
    console.warn("LocalStorage nu este disponibil în acest browser.");
    return false;
  }
};

export const removeFromLocalStorage = (id, name) => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const existingItems = JSON.parse(localStorage.getItem("favorites")) || [];

      const updatedItems = existingItems.filter(
        (item) => item.date !== id || item.location.name !== name
      );

      localStorage.setItem("favorites", JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error("Eroare la ștergerea din LocalStorage: ", error);
      return false;
    }
  } else {
    console.warn("LocalStorage nu este disponibil în acest browser.");
    return false;
  }
};

export const getFavoritesFromLocalStorage = () => {
  const favoritesJson = localStorage.getItem("favorites");
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};

export const checkIfFavoriteExists = (id, name) => {
  const favoritesFromLocalStorage =
    JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favoritesFromLocalStorage.some(
    (itm) => itm.date === id && itm.location.name === name
  );

  return exists;
};

export const updateFavoritesInLocalStorage = (updatedFavorites) => {
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};
