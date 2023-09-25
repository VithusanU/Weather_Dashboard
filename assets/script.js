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
function displayTodayWeather(data) {
  var cityName = data.name;
  var temperature = data.main.temp;
  var weatherDescription = data.weather[0].description;
  var iconCode = data.weather[0].icon;
  var humidity = data.main.humidity;
  var windSpeed = data.wind.speed;

  // Create an HTML structure for the weather information
  var weatherHtml = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${cityName}</h5>
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

// Rest of your code...





// Attempt to retrieve and parse data from localStorage
try {
  var historyData = localStorage.getItem("history");
  if (historyData) {
    searchHistoryArray = JSON.parse(historyData);
  }
} catch (error) {
  console.error('Error parsing localStorage data:', error);
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

    // Verify the constructed apiUrl
    console.log('API URL:', apiUrl);

    // Make the API request
    fetch(apiUrl)





    // Call weatherForecast function with the desired city name
    weatherForecast(searchTerm);




  

    function renderForecastCards(forecastData) {
      // Assuming forecastData is an array containing weather forecast for upcoming days

      // Clear any existing forecast cards
      $("#forecastCards").empty();

      // Loop through the next 5 days of forecast data
      for (var i = 1; i <= 5; i++) {
        var forecast = forecastData[i]; // Assuming the data is structured accordingly

        // Create a forecast card with the same HTML structure as the large card
        var cardHtml = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${forecast.cityName}</h5>
          <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather Icon">
          <p class="card-text">Temperature: ${forecast.temperature}°C</p>
          <p class="card-text">Description: ${forecast.weatherDescription}</p>
          <p class="card-text">Humidity: ${forecast.humidity}%</p>
          <p class="card-text">Wind Speed: ${forecast.windSpeed} km/hr</p>
        </div>
      </div>
    `;

        // Append the card to the forecast cards container
        $("#forecastCards").append(cardHtml);
      }
    }



    // Function to get the user's current location
    function getCurrentLocationWeather() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          getWeatherByCoordinates(lat, lon);
        });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }

    // Function to get weather data by coordinates
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
        });
    }
  };








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