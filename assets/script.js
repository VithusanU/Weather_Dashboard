var timeDisplayE1 = $('#time')
var apiKey = '109c6568e7cb22d03d5bbd6b437053a5'
var lat;
var lon;
var listCounter = 0; // Initialize listCounter
var searchTerm;
var city;
var cityInputEl = $('#search-value');
var searchHistoryE1 = $('#historyButtons');
var countrySelect = $('#countrySelect')

//local storage arrays 
var searchHistoryArray = [];





// Define the displayTodayWeather function in the global scope
function displayTodayWeather(data, forecastData) {
  var cityName = data.name;
  var temperature = data.main.temp;
  var weatherDescription = data.weather[0].description;
  var iconCode = data.weather[0].icon;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;


  // Create an HTML structure for the weather information
  var weatherHtml = `
    <div class="card">
    <div class= 'card-header has-background-primary-light'>
            <h5 class="card-title">${cityName}</h5>
    </div>
      <div class="card-body">

        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <p class="card-text">Temperature: ${temperature}°C</p>
        <p class="card-text">Description: ${weatherDescription}</p>
        <p class="card-text">Humidity: ${humidity}%</p>
        <p class="card-text">Wind Speed: ${windSpeed} km/hr</p>
      </div>
    </div>
  `;

  // Update the large card with the weather information
  $("#largeCard").html(weatherHtml);
  renderForecastCards(forecastData);
}


function renderForecastCards(forecastList, cityName) {
  // Clear any existing forecast cards
  $("#forecastCards").empty();

  // Check if forecastList is defined and is an array with at least one element
  if (Array.isArray(forecastList) && forecastList.length > 0) {
    // Loop through the forecast data
    forecastList.forEach(function (forecast) {
      var date = new Date(forecast.dt * 1000); // Convert timestamp to date
      var dateStr = date.toLocaleDateString(); // Format the date as a string
      var cityName = cityName; // Use the provided city name
      var temperature = forecast.main.temp;
      var weatherDescription = forecast.weather[0].description;
      var iconCode = forecast.weather[0].icon;
      var humidity = forecast.main.humidity;
      var windSpeed = forecast.wind.speed;

      // Create a forecast card with the date, city, and weather information
      var cardHtml = `
        <div class="card">
       <div class= "card-header has-background-primary-light"
       <h5 class="card-title">${dateStr} - ${cityName}</h5>
       </div>
          <div class="card-body">
            
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p class="card-text">Temperature: ${temperature}°C</p>
            <p class="card-text">Description: ${weatherDescription}</p>
            <p class="card-text">Humidity: ${humidity}%</p>
            <p class="card-text">Wind Speed: ${windSpeed} km/hr</p>
          </div>
        </div>
      `;

      // Append the card to the forecast cards container
      $("#forecastCards").append(cardHtml);
    });
  } else {
    // Handle the case where forecastList is undefined or empty
    console.error('Invalid or empty forecast data:', forecastList);
  }
}




function getCurrentLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log("Fetching forecast data for current location...");
      getWeatherForecastByCoordinates(lat, lon);
      getWeatherByCoordinates(lat, lon);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function getWeatherForecastByCoordinates(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(function (data) {
      console.log("Forecast data received:", data);

      // Check if the "list" property exists in the API response
      if (data && data.list && Array.isArray(data.list) && data.list.length > 0) {
        // Extract the city name from the response data
        var cityName = data.city.name;
        // Extract the forecast data
        var forecastData = data.list;

        // Create an object to group forecasts by date
        var groupedForecast = {};

        // Loop through the forecast data and group it by date
        forecastData.forEach(function (forecast) {
          var date = forecast.dt_txt.split(' ')[0];
          if (!groupedForecast[date]) {
            groupedForecast[date] = [];
          }
          groupedForecast[date].push(forecast);
        });

        // Get the unique dates
        var uniqueDates = Object.keys(groupedForecast);

        // Sort the dates in ascending order
        uniqueDates.sort();

        // Get the forecasts for the next 5 days
        var next5DaysData = uniqueDates.slice(0, 5).map(function (date) {
          return groupedForecast[date][0]; // Take the first forecast for each day
        });

        // Check if the filtered forecast data is not empty
        if (next5DaysData.length > 0) {
          // Display today's weather and the next 5 days' forecast
          displayTodayWeather(next5DaysData[0], cityName);
          renderForecastCards(next5DaysData.slice(1), cityName);
        } else {
          console.error('Invalid or empty forecast data:', forecastData);
        }
      } else {
        console.error('Invalid forecast data format:', data);
      }
    })
    .catch(function (error) {
      console.error('Fetch error:', error);
      console.log("Forecast data received:", data);

    });
}






function getWeatherByCoordinates(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(function (data) {
      // Process the data and display today's weather in the large card
      displayTodayWeather(data);
    })
    .catch(function (error) {
      console.error('Fetch error:', error);
      console.log("Forecast data received:", forecastData);
      console.log("Forecast data received:", data);
    });
}


// Attempt to retrieve and parse data from localStorage
try {
  var historyData = localStorage.getItem("history");
  if (historyData) {
    searchHistoryArray = JSON.parse(historyData);
  }
} catch (error) {
  console.error('Error parsing localStorage data:', error);
}

// Function to update the search history and append buttons
function updateSearchHistory(city) {
  // Add the city to the search history array
  searchHistoryArray.push(city);

  // Remove duplicate cities (if any) and limit the history to a certain number of items
  searchHistoryArray = [...new Set(searchHistoryArray)];
  if (searchHistoryArray.length > 5) {
    searchHistoryArray.shift(); // Remove the oldest entry if there are more than 5 items
  }

  // Store the updated search history in localStorage
  localStorage.setItem("history", JSON.stringify(searchHistoryArray));

  // Clear the search history buttons
  searchHistoryE1.empty();

  // Create and append buttons for each item in the search history
  searchHistoryArray.forEach(function (item) {
    var historyButton = $("<button>")
      .addClass("btn btn-secondary w-100 m-1")
      .text(item);

    // Add a click event listener to each history button
    historyButton.on("click", function () {
      weatherFunction(item);
    });

    searchHistoryE1.append(historyButton);
  });
}

$(document).ready(function () {
  $("#search-button").on("click", function () {
    searchTerm = $("#search-value").val();
    console.log('searchTerm:', searchTerm); // Add this line to check the value
    $("#search-value").val("");
    // Call weatherFunction with the searchTerm
    weatherFunction(searchTerm);
  });

  // Add an event listener to the form for Enter key press
  $("#weather-search-form").on("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    searchTerm = $("#search-value").val().trim();
    var selectedCountry = $("#countrySelect").val();

    if (!searchTerm || selectedCountry === "Select Country") {
      // Display an alert if either the city or country is not selected
      alert("Please enter a valid city and select a country.");
      return; // Exit the function to prevent further execution
    }

    // Proceed with fetching weather data if both city and country are provided
    // Call weatherFunction with the searchTerm
    weatherFunction(searchTerm);

    $("#largeCard").show();
  });

  function displayTime() {
    var today = dayjs();
    var rightNow = today.format(" MMM DD, YYYY [at] hh:mm a");
    timeDisplayE1.text(`It is ${rightNow}`);
    setTimeout(displayTime, 1000);
  }
  displayTime();






  //Testing and practice for trying to create the nested html structure from Javascript
  // This function creates the nested HTML structure for the large card and appends it to the #largeCard element.
  function createLargeCard() {
    // Create big card element with class 'card'
    var bigCard = document.createElement('div');
    bigCard.classList.add('card');

    // Create header element with the text 'Weather'
    var headerTxt = document.createElement('h5');
    headerTxt.classList.add('card-header');
    headerTxt.textContent = '';

    // Create card body element with class 'card-body'
    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create the 'today' div
    var todayDiv = document.createElement('div');
    todayDiv.id = 'today';
    todayDiv.classList.add('mt-3');

    // Create the 'forecast' div
    var forecastDiv = document.createElement('div');
    forecastDiv.id = 'forecast';
    forecastDiv.classList.add('card-deck', 'mt-3');

    // Append the 'today' and 'forecast' divs to the card body
    cardBody.appendChild(todayDiv);
    cardBody.appendChild(forecastDiv);

    // Append headerTxt and cardBody to the big card
    bigCard.appendChild(headerTxt);
    bigCard.appendChild(cardBody);

    // Append the big card to the #largeCard element with class 'col-lg-9'
    $("#largeCard").addClass("col-lg-9").append(bigCard);
  }


  // Call the createLargeCard function to create the nested HTML structure
  createLargeCard();

  function weatherFunction(city, country) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('City not found. Please check the spelling.');
        }
      })
      .then(function (data) {
        console.log('API Response Data:', data); // Log the API response data
        // Call displayTodayWeather with the weather data
        displayTodayWeather(data);
        // Call weatherForecast with the city name
        weatherForecast(city);
      })
      .catch(function (error) {
        alert('Error: ' + error.message);
      });
  }
  function weatherForecast(cityName) {
    // Define the API URL for 5-day forecast
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Make the API request
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('City not found. Please check the spelling.');
        }
      })
      .then(function (data) {
        console.log('API Response Data:', data); // Log the API response data

        // Filter the data for the next 5 days (assuming each day has data at similar time intervals)
        var next5DaysData = data.list.filter(function (forecast, index) {
          // Filter based on the time of the forecast (e.g., every 8th entry for a 24-hour interval)
          return index % 8 === 0;
        });

        console.log('Filtered Data:', next5DaysData); // Log the filtered data

        // Call renderForecastCards with the filtered data
        renderForecastCards(next5DaysData, cityName);
      })
      .catch(function (error) {
        alert('Error: ' + error.message);
      });
  }









  // Event listener for the "Use Current Location" button click
  $("#use-current-location").on("click", function () {
    getCurrentLocationWeather();
  });






  var init = function () {
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
      searchHistoryArray = searchHistory.split(',')
    }
    listCounter = listCounter + searchHistoryArray.length;
    for (let index = 0; index < searchHistoryArray.length; index++) {
      var historyOl = document.querySelector('#history-list')
      var historyLi = document.createElement('li')

      var historyButton = document.createElement('button')
      historyButton.textContent = searchHistoryArray[index];
      historyButton.classList = "btn btn-secondary w-100 m-1"
      historyButton.setAttribute('type', 'button')

      historyOl.appendChild(historyLi);
      historyLi.appendChild(historyButton);
      // Update searchHistoryArray with new data
      // ...

      // Store updated data in localStorage
      localStorage.setItem("history", JSON.stringify(searchHistoryArray));

    }

    function submitHandler(event) {
      event.preventDefault();
      var cityName = this.cityNameSearch.value.trim();
      var countryName = this.countrySelect.value;

      if (cityName && countryName != "Select Country") {
        getGeoCode(cityName, countryName);
        cityNameSearch.textContent = '';
        countrySelect.value = 'Select Country';
      } else {
        alert('Please enter valid city and country name');
      }
    }

    //call init function to setup page, add event listener for the form
    init()
  }
});
