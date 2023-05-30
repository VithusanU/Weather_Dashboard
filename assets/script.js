$(document).ready(function () {
    //search button feature
    $("#search-button").on("click", function () {
      //get value in input search-value.
      var searchTerm = $("#search-value").val();
      //empty input field.
      $("#search-value").val("");
      weatherFunction(searchTerm);
      weatherForecast(searchTerm);
    });
  
    //search button enter key feature. 
    $("#search-button").keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode) {
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
      }
    });
  
    //pull previous searches from local storage
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
})