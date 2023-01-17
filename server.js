"use strict";

// *** require dependencies ***

const express = require("express");
require("dotenv").config();
const cors = require("cors");

// *** Once express is in we need to use it - per express docS
// *** App is the express server ***

const app = express();
// *** cors is a middleware that allows us to use cors in our app ***
app.use(cors());
// *** DEFINE A PORT FOR MY SERVER TO RUN ON ***

const PORT = process.env.PORT || 3002;

//*** ENDPOINTS ***/
app.get("/"),
  (request, response) => {
    response.status(200).send("Welcome to my server");
  };

app.get("/hello"),
  (request, response) => {
    console.log(request.query);

    let firstName = request.query.firstName;
    let lastName = request.query.lastName;

    response.status(200).send(`Hello ${firstName} ${lastName}`);
  };

// *** CATCH ALL ENDPOINT ***
app.use("*", (request, response) => {
  response.status(404).send("Sorry, that route does not exist");
});

// *** ERROR HANDLING ***
app.use((error, request, response, next) => {
  response
    .status(500)
    .send("Sorry, something went wrong on our end. Please try again later");
});

// *** SERVER START ***

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
