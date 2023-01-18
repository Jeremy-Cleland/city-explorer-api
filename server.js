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

app.get("/weather", (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.city_name;

    let dataToGroom = data.find((city) => city.city_name === searchQuery);
    let dataToSend = new Forcast(dataToGroom, lat, lon);
    console.log(dataToSend);
    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

class Forcast {
  constructor(city, lat, lon) {
    this.dateOne = city.data[0].valid_date;
    this.descriptionOne = city.data[0].weather.description;
    this.dateTwo = city.data[1].valid_date;
    this.descriptionTwo = city.data[1].weather.description;
    this.dateThree = city.data[2].valid_date;
    this.descriptionThree = city.data[2].weather.description;
    this.lat = lat;
    this.lon = lon;
  }
}

app.get("*", (request, response) => {
  response.status(404).send("Sorry, thatd route does not exist");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
