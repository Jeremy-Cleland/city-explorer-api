'use strict';
const axios = require('axios');

let cache = require('./cache.js');

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=4&units=I`;

  if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
    console.log('Cache Hit. Weather data present');
  } else {
    console.log('Cache Miss. No weather data present');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url).then((response) => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map((dayObj) => {
      return new Weather(dayObj);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(dayObj) {
    this.date = dayObj.datetime;
    this.date = dayObj.valid_date;
    this.high_temp = dayObj.high_temp;
    this.low_temp = dayObj.low_temp;
    this.description = dayObj.weather.description;
  }
}

module.exports = getWeather;
