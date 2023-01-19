'use strict';

// **** REQUIRES ****

const express = require('express');
require('dotenv').config();
const cors = require('cors');

// **** APP DECLARATION ****
const app = express();
const axios = require('axios');

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server');
});

// **** ROUTES ****

app.get('/weather', async (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let dataToGroom = await axios.get(url);
    dataToGroom = dataToGroom.data.data;

    let weatherData = dataToGroom.map((day) => new Forecast(day));
    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
  }
});

app.get('/movies', async (request, response, next) => {
  try {
    let searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    let dataToGroom = await axios.get(url);
    dataToGroom = dataToGroom.data.results;

    let movieData = dataToGroom.map((movie) => new Movie(movie));
    response.status(200).send(movieData);
  } catch (error) {
    next(error);
  }
});

// ***** Class to groom bulky data
class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.vote_average = movieObj.vote_average;
    this.vote_count = movieObj.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500' + movieObj.poster_path;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
  }
}

class Forecast {
  constructor(dayObj) {
    this.date = dayObj.valid_date;
    this.high_temp = dayObj.high_temp;
    this.low_temp = dayObj.low_temp;
    this.description = dayObj.weather.description;
  }
}

// **** ERROR HANDLERS ****
app.use('*', (request, response) => {
  response.status(404).send('Sorry, that route does not exist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error);
});

// *** START SERVER ***
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
