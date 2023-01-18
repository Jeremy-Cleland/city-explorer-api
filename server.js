"use strict";

// **** REQUIRES ****

const express = require("express");
require("dotenv").config();
const cors = require("cors");

let data = require("./data/weather.json");

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3002;

app.get("/", (request, response) => {
  response.status(200).send("Welcome to my server");
});

// weather?lat=value&lon=value&searchQuery=value
// *** DEFINE WEATHER ENDPOINT WITH THE FOLLOWING QUERIES - lat, lon, searchQuery
app.get("/weather", (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let cityName = request.query.searchQuery;

    console.log(request.query);

    let city = data.find(
      (city) => city.city_name.toLowerCase() === cityName.toLowerCase()
    );

    let weatherData = city.data.map((dayObj) => new Forecast(dayObj));

    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});
// **** FORECAST CLASS TO GROOM BULKY DATA ****
class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

// **** CATCH ALL ENDPOINT - NEEDS TO BE YOUR LAST DEFINED ENDPOINT ****
app.get("*", (request, response) => {
  response.status(404).send("This page does not exist");
});

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// ***** SERVER START ******
app.listen(PORT, () => console.log(`We are running on port: ${PORT}`));
