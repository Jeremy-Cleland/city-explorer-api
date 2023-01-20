'use strict';
const axios = require('axios');

let cache = require('./cache.js');

async function getMovies(req, res) {
  try {
    let searchQuery = req.query.searchQuery;

    // *** Setup the key for the cache ***
    let key = searchQuery + 'Movies';
    // *** Check if cache has the data ***
    if (cache[key] && Date.now() - cache[key].timestamp < 1000 * 20) {
      console.log('Cache Hit. Movie data present');
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache Miss. No movie data present');
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`
      );
      let movieList = movieResponse.data.results.map((movie) => {
        return new Movie(movie);
      });
      cache[key] = {
        data: movieList,
        timestamp: Date.now(),
      };
      res.send(movieList);
    }
  } catch (e) {
    res.status(500).send('Route Error - Movies');
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.description = movie.overview;
    this.releaseDate = movie.release_date;
    this.vote_average = movie.vote_average;
    this.vote_count = movie.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    this.popularity = movie.popularity;
  }
}

module.exports = getMovies;
