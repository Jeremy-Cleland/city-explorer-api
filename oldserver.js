'use strict';

// ** REQUIRES**
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const getMovies = require('./modules/movie.js');
const getWeather = require('./modules/weather.js');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});
app.get('/movies', getMovies);
app.get('/weather', getWeather);

app.get('*', (request, response) => {
  response.status(404).send('Error');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
