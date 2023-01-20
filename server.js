'use strict';

// ** REQUIRES**
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const getMovies = require('./modules/movie.js');
const getWeather = require('./modules/weather.js');

const app = express();

// Middleware

app.use(cors());

// Define a port for server to run on with a back up

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

app.get('*', (request, response) => {
  response.status(404).send('Error');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Server start
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
