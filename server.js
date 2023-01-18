"use strict";

console.log("Yasss our first server!");

// **** REQUIRES ****
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// *** FOR LAB DON'T FORGET TO REQUIRE YOUR STARTER JSON FILE ***

let data = require("./data/weather.json");

// **** Once express is in we need to use it - per express docs
// *** app === server
const app = express();

// *** cors is middleware - security guard that allows us to share resources across the internet **
app.use(cors());

// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***
const PORT = process.env.PORT || 3001;

// **** ENDPOINTS ****

// *** Base endpoint - proof of life
// ** 1st arg - endpoint in quotes
// ** 2nd arg - callback which will execute when someone hits that point

// *** Callback function - 2 parameters: request, response (req,res)

app.get("/", (request, response) => {
  response.status(200).send("Welcome to my server");
});
app.get("/hello", (request, response) => {
  console.log(request.query);

  let firstName = request.query.firstName;
  let lastName = request.query.lastName;

  response.status(200).send(`Hello ${firstName} ${lastName}`);
});

app.get("/weather", (req, res, next) => {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let searchQuery = req.query.city_name;

    let dataToGroom = data.find((city) => city.city_name === searchQuery);
    let dataToSend = new Forcast(dataToGroom);
    console.log(dataToSend);
    res.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

// *** CLASS TO GROOM BULKY DATA ***

class Forcast {
  constructor(city) {
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

// *** CATCH ALL ENDPOINT ***
app.get("*", (request, response) => {
  response.status(404).send("Sorry, thatd route does not exist");
});

// *** ERROR HANDLING ***
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// *** SERVER START ***

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
