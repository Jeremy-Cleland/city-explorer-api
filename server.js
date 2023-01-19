"use strict";

// **** REQUIRES ****

const express = require("express");
require("dotenv").config();
const cors = require("cors");

// **** APP DECLARATION ****
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/", (request, response) => {
  response.status(200).send("Welcome to my server");
});

// **** ROUTES ****
app.get("/weather", async (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let forcastResults = await axios.get(url);

    let weatherData = forcastResults.data.data.map((day) => {
      return new Forecast(day);
    });
    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});

// **** FORECAST CLASS TO GROOM BULKY DATA ****
class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
  }
}

// **** ERROR HANDLERS ****
app.use("*", (request, response) => {
  response.status(404).send("Sorry, that route does not exist");
});

app.use((error, request, response, next) => {
  response.status(500).send(error);
});

// *** START SERVER ***
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
