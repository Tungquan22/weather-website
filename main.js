const form = document.querySelector('form');
form.addEventListener('submit', submitForm);


function submitForm(e) {
    e.preventDefault();
    getCity();
}

function getCity() {
    const input = document.querySelector('input[type="text"]');
    const city = input.value;
    fetchWeatherData(city); 
}

async function fetchWeatherData(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4dff9c297726794452f1b3fb6cdfa44d&units=metric`,
        {mode: "cors"}
    );

    if (response.ok) {
        const weatherData = await response.json();
        displayWeatherData(extractWeatherData(weatherData));
    } else {
        throwErrorMessage();
    }

    form.reset();
}

function throwErrorMessage() {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = "Cannot retrieve data right now.";
}


function extractWeatherData(data) {
    // Process timezone data
    let timezone = data["timezone"] / 3600;
    if (timezone < 0) {
        timezone = "GMT" + timezone;
    } else {
        timezone = "GMT+" + timezone;
    }

    // Process temperature/feels like data
    let temperature = data["main"]["temp"];
    temperature = Math.round(temperature, 2) + " °C";
    let feelsLike = data["main"]["feels_like"];
    feelsLike = Math.round(feelsLike, 2) + " °C";

    //Process humidity data
    let humidity = data["main"]["humidity"];
    humidity = humidity + "%";

    const newData = {
        city: data["name"],
        timezone: timezone,
        main: data["weather"][0]["main"],
        description: data["weather"][0]["description"],
        temperature: temperature,
        feels_like: feelsLike,
        humidity: humidity,
    }

    return newData;
}

function displayWeatherData(data) {
    const city = document.querySelector(".general-container#city");
    const timezone = document.querySelector(".general-container#timezone");
    const main = document.querySelector(".general-container#main");
    const description = document.querySelector(".general-container#description");

    city.textContent = data["city"];
    timezone.textContent = data["timezone"];
    main.textContent = data["main"];
    description.textContent = data["description"];

    const temperature = document.querySelector(".info#temperature");
    const feelsLike = document.querySelector(".info#feels-like");
    const humidity = document.querySelector(".info#humidity");

    temperature.textContent = data["temperature"];
    feelsLike.textContent = data["feels_like"];
    humidity.textContent = data["humidity"];
}