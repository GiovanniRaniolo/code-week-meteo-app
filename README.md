# Ragusa Meteo

Welcome to Ragusa Meteo, a sleek and responsive weather application that provides real-time weather updates for Ragusa and surrounding cities. This application is built with **HTML**, **CSS**, and **JavaScript**, utilizing the [OpenWeatherMap API](https://openweathermap.org) to fetch and display weather data. The background images are uniquely created using AI technology (**DALL-E 3**), enhancing the user experience with visually appealing and contextually relevant visuals. Whether you're a beginner or an experienced developer, this guide will walk you through the application's structure, functionality, and implementation details.


![enter image description here](https://i.imgur.com/NVdqPyd.png)


 ![enter image description here](https://i.imgur.com/6InuFBM.png) | ![Mobile](https://i.imgur.com/o3KR3fZ.png) 


## Table of Contents

-   [Introduction](#ragusa-meteo)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Setup and Installation](#setup-and-installation)
-   [Application Structure](#application-structure)
    -   [HTML](#html)
    -   [CSS](#css)
    -   [JavaScript](#javascript)
-   [API Integration](#api-integration)
-   [Event Handling](#event-handling)
-   [Background and Icon Logic](#background-and-icon-logic)
-   [Error Handling](#error-handling)
-   [Media Queries and Responsiveness](#media-queries-and-responsiveness)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   Real-time weather updates 
-   Dedicated panel for Ragusa (IT) and surrounding cities
-   Detailed weather conditions including temperature, humidity, wind speed, and more
-   Dynamic background AI generated images based on weather conditions and time of day
-   User-friendly interface with search functionality
-   Error handling with user feedback

## Technologies Used

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   OpenWeatherMap API
-   Font Awesome

## Setup and Installation

1.  **Clone the repository:**
    
    `git clone https://github.com/yourusername/ragusa-meteo.git` 
    
2.  **Navigate to the project directory:**
   
    
    `cd ragusa-meteo` 
    
3.  **Run the app:** 

    run the file: `index.html`

> This project doesn't have any npm dependencies, but ensure you have a
> modern browser to run the application.


4.  **Create a `keys.js` file in the project root and add your OpenWeatherMap API key:**

    ```js
    // keys.js
    export const API_KEY = 'YOUR_API_KEY_HERE';`
    ``` 
    
5.  **Open `index.html` in your browser to run the application**
    

## Application Structure

### HTML

The HTML structure consists of a global container that includes the weather display, city and time details, a search form, a city list, weather details, and a modal for error messages.

### CSS

The CSS files are structured to provide a responsive and visually appealing design. It includes styles for the main layout, weather conditions, search form, city list, weather details, modal for error messages and responsive media query.

```css
/* <=== GLOBAL ===> 
global window, logo and typography) */
@import url('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
@import url("./css/global.css");

/* <=== MAIN SECTION ===> 
temperature, conditions, city name and date */
@import url("./css/main-section.css");

/* <=== PANEL ===> 
search-bar, highlighted cities, details */
@import url("./css/panel.css");

/* <=== MODAL ===> 
warning and error messages */
@import url("./css/modal.css");

/* <=== MEDIA-QUERY ===> 
responsive adaptation */
@import url("./css/media-query.css");
```

### JavaScript

The JavaScript file (`script.js`) handles fetching weather data from the OpenWeatherMap API, updating the UI based on the fetched data, handling user inputs, and managing errors.

#### Importing the API Key

The API key required for accessing the OpenWeatherMap API is imported from a separate file that you need to name `keys.js`.

```js
`import { API_KEY } from "./keys.js";` 
```

#### Constants and DOM Element Selections
Various constants are defined to hold references to DOM elements and a list of cities. These references are used later to update the UI with weather data.

```js
`const panelCities = ["ragusa", "vittoria", "modica", "comiso", "scicli", "ispica", "comune di pozzallo", "santa croce camerina", "acate", "chiaramonte gulfi", "giarratana", "monterosso almo"];
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
let cityInput = "ragusa,IT";` 
```

#### Event Listeners for Predefined Cities

In this code, we have a function that is immediately invoked (IIFE) and adds an event listener to each city element. When a city is clicked, it updates the ```cityInput``` variable with the name of the clicked city, fetches weather data using the ```fetchWeatherData()``` function, and hides the weather app by setting its opacity to "0". The function is documented using comments, which provide information about the function's purpose, parameters, and return values.

```js
/*
 * Event listener for predefined cities.
 * When a city is clicked, it updates the cityInput variable, fetches weather data,
 * and hides the weather app.
 * @param {HTMLElement} city - The city element that was clicked.
 */
cities.forEach((city) => {
	city.addEventListener("click", (e) => {
		cityInput  =  e.target.innerHTML;
		fetchWeatherData();
		app.style.opacity  =  "0";
	});
});
```

#### Showing the Error Modal

This function is used to display a modal with a warning or error message. It takes a string parameter ```message``` which is the text to be displayed in the modal. The function manipulates the DOM to show the modal and set its content. It also adds event listeners to the close button and the window to handle closing the modal when clicked outside of it. The function does not return any value.

```js
function showFeedback(message) {
    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('modal-text');
    modalText.textContent = message;
    modal.style.display = 'block';

    const span = document.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
```

#### Event Listener for the Search Form

An event listener is added to the search form. When the form is submitted, it checks if the search input is empty. If it is not, it sets the `cityInput` to the search value, fetches the weather data, and clears the search input. The form submission is prevented from its default behavior.

```js
/*
 * Event listener for the search form.
 * Validates the input, updates the cityInput, fetches weather data, clears the search input,
 * and hides the weather app to provide a smooth transition.
 *
 * @param {Event} e - The event object representing the form submission.
 * @returns {void}
 */
(e) => {
    if (search.value.length == 0) {
        // Show a warning message if the search input is empty.
        showFeedback(`Per favore, inserisci un nome valido di una località`);
    } else {
        // Update the cityInput with the search input value.
        cityInput = search.value;

        // Fetch weather data for the updated cityInput.
        fetchWeatherData();

        // Clear the search input.
        search.value = "";

        // Hide the weather app to provide a smooth transition.
        app.style.opacity = "0";
    }

    // Prevent the form from submitting.
    e.preventDefault();
}
```

#### Getting the Day of the Week

The `dayOfTheWeek` function returns the name of the day of the week for a given date.

```js
/*
 * This function calculates the day of the week based on the provided date.
 *
 * @param {number} day - The day of the month (1-31).
 * @param {number} month - The month of the year (0-11).
 * @param {number} year - The year.
 *
 * @returns {string} The day of the week in Italian.
 */
function dayOfTheWeek(day, month, year) {
    // Array of weekdays in Italian
    const weekday = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

    // Create a new Date object with the provided parameters
    // and get the day of the week using the getDay() method
    // Return the corresponding weekday from the array
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}
```

#### Selecting a Random Image
The next code snippet is a function named `getRandomImage`. This function is responsible for selecting a random image (made with AI) based on the weather condition and time of day.

The function takes two parameters: `condition` and `timeOfDay`. The `condition` parameter represents the weather condition (e.g., *clear*, *clouds*, *rain*, *snow*), and the `timeOfDay` parameter represents the time of day (e.g., *day*, *night*).

Inside the function, a random index is generated using `Math.floor(Math.random() * 6)`. This index is used to select a random image from the corresponding directory within the `images` folder.

The function then constructs the path to the random image using template literals. The path is constructed based on the `timeOfDay` and `condition` parameters, and the random index.

For example, if the `condition` is "*clear*" and the `timeOfDay` is "*day*", the function will return the path to a random image from the `./images/day-rg/clear0.jpg` to `./images/day-rg/clear5.jpg` directory.

This function is used to provide a variety of background images based on the weather condition and time of day, representing Ragusa and its neighboring cities (provincia). These images are applied only to the highlighted cities. The randomness helps to create a more dynamic and engaging user experience.

```js
/*
 * This function generates a random image URL based on the weather condition and time of day.
 *
 * @param {string} condition - The weather condition (e.g., 'clear', 'clouds', 'rain', 'snow').
 * @param {string} timeOfDay - The time of day ('day' or 'night').
 * @returns {string} - The URL of the random image.
 */
function getRandomImage(condition, timeOfDay) {
    // Generate a random index between 0 and 5
    const randomIndex = Math.floor(Math.random() * 6); 

    // Construct the image URL using the condition and timeOfDay parameters
    return `./images/${timeOfDay}-rg/${condition}${randomIndex}.jpg`;
}
```

#### Correlating the Weather Icon

 This function is responsible for determining the appropriate weather icon based on the given weather condition.  The function takes a parameter `weatherCondition`, which represents the current weather condition. It converts the condition to lowercase to ensure case-insensitive comparison.  Inside the function, a switch statement is used to match the weather condition with the corresponding icon. If the condition matches any of the cases, the function returns the corresponding image path. If the condition does not match any of the cases, it returns a default image path for an unknown condition.  The available weather conditions and their corresponding icon paths are as follows:

- 'clear': `'./images/clear.png'`

- 'clouds': `'./images/cloudy.png'`

- 'rain': `'./images/rainy.png'`

- 'snow': '`./images/snow.png'`

- Default case: '`./images/unknown.png'`


```js
/*
 * This function is used to get the appropriate weather icon based on the weather condition.
 *
 * @param {string} weatherCondition - The weather condition to match with the icon.
 * @returns {string} - The URL of the weather icon image.
 */
function getWeatherIcon(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return './images/clear.png';
        case 'clouds':
            return './images/cloudy.png';
        case 'rain':
            return './images/rainy.png';
        case 'snow':
            return './images/snow.png';
        default:
            return './images/unknown.png';
    }
}
```

#### Update the DOM with the weather data

This function is responsible for updating the weather data displayed in the web application. It retrieves the necessary information from the weather API response and populates the corresponding HTML elements with the appropriate data.

Here's a breakdown of the code:

1. The function `updateWeatherData(data)` is called with the weather data as an argument.

2. The temperature is calculated by rounding the `main.temp` value from the API response to one decimal place and appending the degree symbol and the unit (c°). The result is then inserted into the HTML element with the class `temp`.

3. The weather condition description is extracted from the `weather[0].description` field of the API response and inserted into the HTML element with the class `condition`.

4. The date and time are extracted from the `dt` field of the API response, converted to a JavaScript Date object, and formatted accordingly. The date is displayed in the format "Day, DD/MM/YYYY", and the time is displayed in the format "HH:MM". The results are then inserted into the HTML elements with the classes `date` and `time`, respectively.

5. The city name is extracted from the `name` field of the API response and inserted into the HTML element with the class `name`.

6. The weather icon URL is determined by calling the `getWeatherIcon(weatherCondition)` function, which takes the weather condition (main) as an argument. The corresponding icon image is then set as the source of the HTML image element with the class `icon`.

7. The cloud coverage percentage is extracted from the `clouds.all` field of the API response and inserted into the HTML element with the class `cloud`.

8. The humidity percentage is extracted from the `main.humidity` field of the API response and inserted into the HTML element with the class `humidity`.

9. The wind speed is extracted from the `wind.speed` field of the API response and inserted into the HTML element with the class `wind`.

10. The minimum and maximum temperatures are extracted from the `main.temp_min` and `main.temp_max` fields of the API response, respectively. They are rounded to the nearest integer and inserted into the HTML elements with the classes `temp-min` and `temp-max`, respectively.

11. The sunrise and sunset times are extracted from the `sys.sunrise` and `sys.sunset` fields of the API response, converted to a JavaScript Date object, and formatted accordingly. The results are then inserted into the HTML elements with the classes `sunrise` and `sunset`, respectively.


```js
/*
 * Updates the weather data on the webpage.
 *
 * @param {Object} data - The weather data received from the API.
 * @param {number} data.main.temp - The current temperature.
 * @param {string} data.weather[0].description - The weather condition description.
 * @param {number} data.dt - The timestamp of the weather data.
 * @param {number} data.clouds.all - The percentage of cloud cover.
 * @param {number} data.main.humidity - The current humidity.
 * @param {number} data.wind.speed - The current wind speed.
 * @param {number} data.main.temp_min - The minimum temperature for the day.
 * @param {number} data.main.temp_max - The maximum temperature for the day.
 * @param {number} data.sys.sunrise - The timestamp of sunrise.
 * @param {number} data.sys.sunset - The timestamp of sunset.
 * @param {string} data.name - The name of the city.
 * @param {string} data.weather[0].main - The main weather condition.
 *
 * @returns {void}
 */
function updateWeatherData(data) {
    temp.innerHTML = `${Math.ceil(data.main.temp * 10) / 10}c&#176;`;
    conditionOutput.innerHTML = data.weather[0].description;
    const date = new Date(data.dt * 1000);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const time = date.toTimeString().split(' ')[0];

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

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    sunriseOutput.innerHTML = sunrise;
    sunsetOutput.innerHTML = sunset;
}
```

#### Update the app background based on the weather condition and time of day

The `updateBackground` function is responsible for dynamically updating the background image and button color based on the weather conditions and time of day.

Here's a breakdown of the code:

1. The function starts by determining the time of day. If the current hour is between 19:00 and 06:00, it sets `timeOfDay` to "*night*". Otherwise, it defaults to "*day*".

2. The weather condition code and city name are extracted from the weather data.

3. The weather condition is determined based on the weather code. If the code is *800*, it means it's clear. If the code is between *801* and *804*, it means it's cloudy. If the code is between 200 and 599, it means it's *rainy*. Otherwise, it's *snowy*.

4. The function checks if the city name is included in the `panelCities` array. If it is, a random image is selected from the corresponding weather condition and time of day folder using the `getRandomImage` function. The background image is updated accordingly.

5. If the city name is not in the `panelCities` array, the background image is set based on the weather condition and time of day.

6. The button color is updated based on the weather condition and time of day. If it's clear, the button color is set to "*#e5ba92*". If it's cloudy, the button color is set to "*#fa6d1d*". If it's rainy, the button color is set to "*#647d75*". If it's snowy, the button color is set to "*#4d72aa*". If it's night, the button color is set to "*#181e27*".

7. Finally, the opacity of the app is set to "*1*" to make the background visible.

This snippet is crucial for providing a dynamic and visually appealing user experience by changing the background image and button color based on the weather conditions and time of day.

```js
/*
 * Updates the background of the weather app based on the weather condition and time of day.
 * @param {Object} data - The weather data object received from the OpenWeather API.
 * @returns {void}
 */
 
function updateBackground(data) {
    let timeOfDay = "day";
    const date = new Date(data.dt * 1000);
    // Determine if it's day or night based on the current hour
    if (date.getHours() >= 19 || date.getHours() < 6) {
        timeOfDay = "night";
    }

    const code = data.weather[0].id;
    const cityName = data.name.toLowerCase().trim();
    let condition = '';

    // Determine the weather condition based on the weather code
    if (code === 800) {
        condition = 'clear';
    } else if (code >= 801 && code <= 804) {
        condition = 'cloudy';
    } else if (code >= 200 && code < 600) {
        condition = 'rainy';
    } else {
        condition = 'snowy';
    }

    // If the city is in the predefined list, use a random image for the background
    if (panelCities.includes(cityName)) {
        app.style.backgroundImage = `url(${getRandomImage(condition, timeOfDay)})`;
    } else {
        // Otherwise, use a specific image based on the weather condition and time of day
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

    // Update the button background color based on the weather condition and time of day
    btn.style.background = code === 800 ? "#e5ba92" :
        code >= 801 && code <= 804 ? "#fa6d1d" :
        code >= 200 && code < 600 ? "#647d75" : "#4d72aa";
    if (timeOfDay === "night") {
        btn.style.background = "#181e27";
    }

    // Make the app visible after updating the background
    app.style.opacity = "1";
}
```


####  Main function to fetch weather data from OpenWeather API and update the interface

This is the main function `fetchWeatherData()`, which is responsible for fetching weather data from the **OpenWeatherMap** API and updating the user interface.

Here's a breakdown of the code:

1. The function `fetchWeatherData()` is called when the user either selects a predefined city or submits a new city name in the search form.

2. Inside the function, a fetch request is made to the OpenWeatherMap API using the provided `cityInput` and API key. The API endpoint includes query parameters for units (metric), language (Italian), and the app ID.

3. The fetch request returns a Promise that resolves to a Response object. The `response.json()` method is then called to parse the response body as JSON.

4. If the fetch request is successful, the Promise resolves to the parsed JSON data. The `updateWeatherData()` and `updateBackground()` functions are then called with the data as arguments.

5. If the fetch request fails (e.g., due to a network error or a 404 status code), the Promise is rejected. In this case, the `catch()` block is executed, and the `showFeedback()` function is called with an error message. The opacity of the app is then set back to 1 to display the error message.

```js
/*
 * Fetches weather data from OpenWeather API and updates the interface.
 *
 * @function fetchWeatherData
 * @returns {void}
 */
function fetchWeatherData() {
    // Construct the API URL with the city input, API key, units, and language parameters
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&units=metric&lang=it`;

    // Fetch the weather data from the API
    fetch(apiUrl)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            // Log the requested city and weather data to the console
            console.log("%c API Response: " + cityInput, "font-size: 1.5em; color: yellow;");
            console.log(data);

            // Update the weather data on the interface
            updateWeatherData(data);

            // Update the background of the app based on the weather data
            updateBackground(data);
        })
        .catch(() => {
            // Show an error message if the city was not found
            showFeedback("Località non trovata, assicurati di essere connesso a internet e riprova!");

            // Reset the app opacity to 1
            app.style.opacity = "1";
        });
}
```

#### Invoke the main function

This part is responsible for invoking the main function `fetchWeatherData()` and setting the initial opacity of the weather application to 1.

The `fetchWeatherData()` function is responsible for fetching weather data and once the data is received, it is processed and used to update the user interface by calling the `updateWeatherData()` and `updateBackground()` functions.

This line is placed after the `fetchWeatherData()` function call to ensure that the weather data is fetched and processed before the user interface is displayed.

Overall, this code snippet is crucial for the proper functioning of the weather application, as it initiates the data fetching process and sets the initial state of the user interface.

```js
/*
 * This function is the entry point of the weather application.
 * It invokes the fetchWeatherData function to retrieve weather data and updates the interface.
 * After fetching the data, it sets the opacity of the app to 1 to make it visible.
 */
function invokeMainFunction() {
    fetchWeatherData();
    app.style.opacity = "1";
}
```

## API Integration

The application uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. The API key is stored in a separate `keys.js` file for security. The API request URL includes parameters for city name, metric units, languages, and the API key.


## Media Queries and Responsiveness

The CSS file includes media queries to ensure the application is responsive across different screen sizes. The layout adapts for mobile and small mobile devices, tablets and desktops, providing a seamless user experience on all devices.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository
2.  Create a new branch: `git checkout -b feature-branch`
3.  Commit your changes: `git commit -m 'Add new feature'`
4.  Push to the branch: `git push origin feature-branch`
5.  Open a pull request