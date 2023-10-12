/*
preeti - Sunrise and sunset (format time)
daniel - Weather forecast (5 day) done

daniel - stretch - More cities (search?)
daniel - stretch - Use location
preeti - stretch - More data

Styling
  stretch - warm/cold
  stretch - Animations

*/

// URL and API KEY
const APIKEY = '859d1c6268a1c95a2e2ded0c95483c8a';
const url = 'https://api.openweathermap.org/data/2.5/';

// HTML elements
const currentWeather = document.getElementById('currentWeather');
const comment = document.getElementById('comment');
const additionalData = document.getElementById('additionalData');
const sunTime = document.getElementById('sunTime');
const forecast = document.getElementById('forecast');
const search = document.getElementById('search');
const searchbtn = document.getElementById('searchbtn');
const minTempElement = document.getElementById('minTemp');
const maxTempElement = document.getElementById('maxTemp');

/*
Function to fetch the current weather of a location provided in the parameter and create html to display it
*/
const getCurrentWeather = (loc) => {
  // merge suntime and add comment, change color
  fetch(`${url}/weather?units=metric${loc}&APPID=${APIKEY}`)
    .then(response => response.json())
    .then((data) => {
      console.log("Current weather", data);
      currentWeather.innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.weather[0].description} | ${data.main.temp.toFixed(1)} °C</p>`;
      switch (data.weather[0].main) {
        case "Clouds":
          document.body.classList = "cloudy";
          break;
        case "Clear":
          document.body.classList = "clear";
          break;
        default:
          document.body.classList = "rain";
      }
    })
    .catch(error => {
      console.log('Error in getCurrentWeather()', error);
      currentWeather.innerHTML = `<h2>Location not found</h2>`
    });
  // Preeti Additional weather data
}

// getSunTime function to correctly update the DOM elements
const getSunTime = (loc) => {
  fetch(`${url}/weather?units=metric${loc}&APPID=${APIKEY}`)
    .then(response => response.json())
    .then(data => {
      const sunriseTimestamp = data.sys.sunrise * 1000; // Convert to milliseconds
      const sunsetTimestamp = data.sys.sunset * 1000; // Convert to milliseconds

      const sunrise = new Date(sunriseTimestamp);
      const sunset = new Date(sunsetTimestamp);

      const sunriseTime = sunrise.toLocaleTimeString();
      const sunsetTime = sunset.toLocaleTimeString();

      // Update the DOM elements with sunrise and sunset times
      // document.querySelector('#sunrise span').textContent = sunriseTime;
      // document.querySelector('#sunset span').textContent = sunsetTime;

      // Calculate the duration of daylight
      const daylightDuration = sunset - sunrise;
      const hours = Math.floor(daylightDuration / (60 * 60 * 1000));
      const minutes = Math.floor((daylightDuration % (60 * 60 * 1000)) / (60 * 1000));

      // Update the daylight element
      // document.querySelector('#daylight span').textContent = `${hours} hours and ${minutes} minutes`;
      sunTime.innerHTML = `<p>Sun Time: ${hours} hours and ${minutes} minutes</p>`;
    })
    .catch(error => {
      console.error('Error fetching sunrise and sunset times:', error);
      sunTime.innerHTML = '';
    });
}

/*
Function to fetch the forecast of a location provided in the parameter and create html to display it
*/
const getForecast = (loc) => {
  // Daniel
  fetch(`${url}/forecast?units=metric${loc}&APPID=${APIKEY}`)
    .then(response => response.json())
    .then((data) => {
      console.log("Weather forecast", data);
      forecast.innerHTML = `
      <h3>5 day forecast</h3>
      <h4>at this time on...</h4>
      <div id="forecastTable"></div>`;
      // The indeces of the forecast the next 24, 48, 72, 96 and 120 hours from the current weather forecast
      const dayIndex = [7, 15, 23, 31, 39];
      const forecastTable = document.getElementById("forecastTable");
      // Not following the exact design as it does not include a full weeks forecast and the date seems more useful
      dayIndex.forEach((day) => {
        forecastTable.innerHTML += `
        <div class="forecastLine">
          <div class="forecastDate">
            ${data.list[day].dt_txt.split(" ")[0]}
          </div>
          <div class="forecastInfo">
            <img class="forecastIcon" src="https://openweathermap.org/img/wn/${data.list[day].weather[0].icon}@2x.png" alt="${data.list[day].weather[0].main}">
            ${data.list[day].weather[0].main} | ${data.list[day].main.temp.toFixed(1)} °C | ${data.list[day].wind.speed.toFixed(1)} m/s
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="transform: rotate(${data.list[day].wind.deg}deg);" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
            </svg>
          </div>
        </div>`;
        // Not 100% sure if the wind direction is correct, comapred to openweather website and it seems to be more or less correct but I am not sure which data they are using
      });
    })
    .catch((error) => {
      console.log("Error in getForecast()", error);
      forecast.innerHTML = '';
    });
}

/*
A function that gets the location provided in the search bar, gps location or a default and gets the weather of that location
*/
const getLocation = () => {
  if ((search.value !== null) && (search.value !== undefined) && (search.value !== '')) {
    getWeather(`&q=${search.value}`);
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(`&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
    });
  } else {
    getWeather(`&q=Stockholm,Sweden`);
  }
}

const getMinMaxTemp = (loc) =>  {
  fetch(`${url}/weather?units=metric${loc}&APPID=${APIKEY}`)
    .then(response => response.json())
    .then(data => {
      const minTemp = data.main.temp_min;
      const maxTemp = data.main.temp_max;

      // Check if min and max temperature data is available
      if (minTemp !== undefined && maxTemp !== undefined) {
        const minTemperature = Math.round(minTemp);
        const maxTemperature = Math.round(maxTemp);

        // Update the DOM elements
        minTempElement.innerHTML = `<p>Lowest: ${minTemperature}°C</p>`;
        maxTempElement.innerHTML = `<p>Highest: ${maxTemperature}°C</p>`;
      } else {
        // Handle the case where the API doesn't provide min and max temperature data
        console.log('API does not provide min and max temperature data');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
/*
A helper function to run the functions required to get the weather and forecast of a location
*/
const getWeather = (loc) => {
  getCurrentWeather(loc);
  getSunTime(loc);
  getForecast(loc);
  getMinMaxTemp(loc)
}

getLocation();
search.addEventListener('change', getLocation);
searchbtn.addEventListener('click', getLocation);
