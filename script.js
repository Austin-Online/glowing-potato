const apiKey = '178485f949008478231caf41f5a34379';
const cityForm = document.querySelector('#city-form');
const cityInput = document.querySelector('#city-input');
const currentWeatherDiv = document.querySelector('#current-weather');
const forecastDiv = document.querySelector('#forecast');
const searchHistoryDiv = document.querySelector('#search-history');

cityForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});

function getWeatherData(city) {
  // Use the OpenWeatherMap API to fetch weather data
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data, city);
        displayForecast(data);
        addToSearchHistory(city);
      })
    .catch(error => console.error('Error fetching weather data:', error));
}


// Function to convert Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9/5) + 32;
  }
  
// Function to display current weather
  function displayCurrentWeather(data, city) {
    const currentWeather = data.list[0];
  
    const cityName = city;
    const date = new Date(currentWeather.dt * 1000).toLocaleDateString();
    const iconCode = currentWeather.weather[0].icon;
     // Convert temperature to Fahrenheit
    const temperature = kelvinToFahrenheit(currentWeather.main.temp);
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
  
    const currentWeatherHTML = `
      <div class="weather-card">
        <h2>${cityName} - ${date}</h2>
        <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
        <p>Temperature: ${temperature.toFixed(2)} °F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;
  
    currentWeatherDiv.innerHTML = currentWeatherHTML;
  }
  
  // Updated displayForecast function
  function displayForecast(data) {
    const forecastList = data.list;
  
    let forecastHTML = '';
  
    for (let i = 0; i < forecastList.length; i += 8) {
      const forecast = forecastList[i];
  
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const iconCode = forecast.weather[0].icon;
       // Convert temperature to Fahrenheit
      const temperature = kelvinToFahrenheit(forecast.main.temp);
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;
  
      forecastHTML += `
        <div class="weather-card">
          <h3>${date}</h3>
          <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
          <p>Temperature: ${temperature.toFixed(2)} °F</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
      `;
    }
  
    forecastDiv.innerHTML = forecastHTML;
  }
  
  
// Function for search history
  function addToSearchHistory(city) {
    const searchHistory = getSearchHistory();
  
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      saveSearchHistory(searchHistory);
      updateSearchHistoryUI(searchHistory);
    }
  }
  
  function getSearchHistory() {
    const searchHistoryJSON = localStorage.getItem('searchHistory');
    return searchHistoryJSON ? JSON.parse(searchHistoryJSON) : [];
  }
  
  function saveSearchHistory(searchHistory) {
    const searchHistoryJSON = JSON.stringify(searchHistory);
    localStorage.setItem('searchHistory', searchHistoryJSON);
  }
  
  function updateSearchHistoryUI(searchHistory) {
    const historyHTML = searchHistory.map(city => {
      return `<div class="history-item">${city}</div>`;
    }).join('');
  
    searchHistoryDiv.innerHTML = historyHTML;
  }
  

// Load and display search history from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    const searchHistory = getSearchHistory();
    updateSearchHistoryUI(searchHistory);
  });
  

// Attach event listener to search history items
searchHistoryDiv.addEventListener('click', function (event) {
    // Get the clicked history item
    const clickedItem = event.target;
  
    // Check if the clicked element is a history item
    if (clickedItem.classList.contains('history-item')) {
      const selectedCity = clickedItem.textContent;
      getWeatherData(selectedCity);
    }
  });
  
