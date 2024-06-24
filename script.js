//import { API_KEY } from "./keys.js";

const panelCities = [
  "ragusa",
  "vittoria",
  "modica",
  "comiso",
  "scicli",
  "ispica",
  "comune di pozzallo",
  "santa croce camerina",
  "acate",
  "chiaramonte gulfi",
  "giarratana",
  "monterosso almo",
];
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const tempMinOutput = document.querySelector(".temp-min");
const tempMaxOutput = document.querySelector(".temp-max");
const sunriseOutput = document.querySelector(".sunrise");
const sunsetOutput = document.querySelector(".sunset");
const form = document.querySelector("#locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
let cityInput = "ragusa,IT";

/*"IMPORTANT!!! CREATE_YOUR_OWN_FILE_keys.js_TO_IMPORT_AT_LINE_1";*/
const API_KEY = "a29cd80110e9362f486fa38a9f70b3dd"; // Don't forget to remove your API Key from here!!!

// Event listeners for predefined cities
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    app.style.opacity = "0";
  });
});

// Function to show the warning-error modal
function showFeedback(message) {
  const modal = document.getElementById("myModal");
  const modalText = document.getElementById("modal-text");
  modalText.textContent = message;
  modal.style.display = "block";

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Event listener for the search form
form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    showFeedback(`Per favore, inserisci il nome valido di una località`);
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
  }
  e.preventDefault();
});

// Function to get the day of the week
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ];
  return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

// Function to get the image based on the weather condition and time of day
function getRandomImage(condition, timeOfDay) {
  const randomIndex = Math.floor(Math.random() * 6);
  return `./images/${timeOfDay}-rg/${condition}${randomIndex}.jpg`;
}

// Function to correlate the weather icon
function getWeatherIcon(weatherCondition) {
  switch (weatherCondition.toLowerCase()) {
    case "clear":
      return "./images/clear.png";
    case "clouds":
      return "./images/cloudy.png";
    case "rain":
      return "./images/rainy.png";
    case "snow":
      return "./images/snow.png";
    default:
      return "./images/unknown.png";
  }
}

// Function to update the DOM with the weather data
function updateWeatherData(data) {
  temp.innerHTML = `${Math.ceil(data.main.temp * 10) / 10}c&#176;`;
  conditionOutput.innerHTML = data.weather[0].description;
  const date = new Date(data.dt * 1000);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const time = date.toTimeString().split(" ")[0];

  dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/${y}`;
  timeOutput.innerHTML = time;
  nameOutput.innerHTML = data.name;

  const weatherIconUrl = getWeatherIcon(data.weather[0].main);
  icon.src = weatherIconUrl;

  cloudOutput.innerHTML = `${data.clouds.all}%`;
  humidityOutput.innerHTML = `${data.main.humidity}%`;
  windOutput.innerHTML = `${data.wind.speed} km/h`;

  tempMinOutput.innerHTML = `${Math.round(data.main.temp_min)}&#176;`;
  tempMaxOutput.innerHTML = `${Math.round(data.main.temp_max)}&#176;`;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "it-IT",
    { hour: "2-digit", minute: "2-digit" }
  );
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  sunriseOutput.innerHTML = sunrise;
  sunsetOutput.innerHTML = sunset;
}

// Function to update the app background based on the weather condition and time of day
function updateBackground(data) {
  let timeOfDay = "day";
  const date = new Date(data.dt * 1000);
  if (date.getHours() >= 19 || date.getHours() < 6) {
    timeOfDay = "night";
  }

  const code = data.weather[0].id;
  const cityName = data.name.toLowerCase().trim();
  let condition = "";

  if (code === 800) {
    condition = "clear";
  } else if (code >= 801 && code <= 804) {
    condition = "cloudy";
  } else if (code >= 200 && code < 600) {
    condition = "rainy";
  } else {
    condition = "snowy";
  }

  if (panelCities.includes(cityName)) {
    app.style.backgroundImage = `url(${getRandomImage(condition, timeOfDay)})`;
  } else {
    if (code === 800) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
    } else if (code >= 801 && code <= 804) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
    } else if (code >= 200 && code < 600) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
    } else {
      app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
    }
  }

  btn.style.background =
    code === 800
      ? "#e5ba92"
      : code >= 801 && code <= 804
      ? "#fa6d1d"
      : code >= 200 && code < 600
      ? "#647d75"
      : "#4d72aa";
  if (timeOfDay === "night") {
    btn.style.background = "#181e27";
  }

  app.style.opacity = "1";
}

// Main function to fetch weather data from OpenWeather API and update the interface
function fetchWeatherData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&units=metric&lang=it`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(
        "%c API Response: " + cityInput,
        "font-size: 1.5em; color: yellow;"
      );
      console.log(data);
      updateWeatherData(data);
      updateBackground(data);
    })
    .catch(() => {
      showFeedback(
        "Località non trovata, assicurati di essere connesso a internet e riprova!"
      );
      app.style.opacity = "1";
    });
}

// Invoke the main function
fetchWeatherData();
app.style.opacity = "1";
