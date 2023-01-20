'use strict';

const axios = require('axios');

async function getMovies(request, response, next) {
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
}

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

// module.exports = getMovies;
