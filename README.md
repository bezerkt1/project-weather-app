# Banana Weather

A weather app project to practice fetching and displaying data from an API (OpenWeather). Developed by Preeti and Daniel!

## Features and Solutions

First the app gets a location, it will first check if there is any value in the search bar to search for, if there is no location in the search bar (The default when you first access the site) it will try to access the location of the browser, if it can't get access to your location from the browser it takes stockholm as a default.

The data is provided from the weather API provided by OpenWeather. Once it has fetched the data it displays the location name, temperature, weather, amount of hours of sunlight, the lowest/highest temperature of the day and a little comment depending on the weather. The theme also changes depending on the weather data.

A 5 day forecast is received from the forecast API and it displays the information such as type of weather, temperature and wind.

## Demo
A deployed version on Netlify can be found on the following link: https://keen-blancmange-daa7bb.netlify.app/
