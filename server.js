"use strict";

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

app.get("/weather", (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let cityName = request.query.searchQuery;

    // TODO find the city in the json

    let city = data.find(
      (city) => city.city_name.toLowerCase() === cityName.toLowerCase()
    );

    let weatherData = city.data.map((dayObj) => new Forcast(dayObj));

    response.status(200).send(city);
  } catch (error) {
    next(error);
  }
});

class Forcast {
  constructor(dayObj) {
    this.dateOne = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}

app.get("*", (request, response) => {
  response.status(404).send("Sorry, thatd route does not exist");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
