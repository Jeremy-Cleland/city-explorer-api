'use strict';

const axios = require('axios');

async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=I`;

    let dataToGroom = await axios.get(url);
    dataToGroom = dataToGroom.data.data;

    let weatherData = dataToGroom.map((dayObj) => new Forecast(dayObj));

    response.status(200).send(weatherData);
  } catch (error) {
    next(error);
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

// module.exports = getWeather;
