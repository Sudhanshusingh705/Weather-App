let weather = {
    "apiKey": config.WEATHER_API,
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=metric&appid=" + this.apiKey
        ).then((response) => {
            if (!response.ok) {
              //alert("No weather found.");
              document.querySelector(".city").innerText = "No weather found :(";
              document.querySelector(".icon").src =  "--";
              document.querySelector(".description").innerText = "--";
              document.querySelector(".temp").innerText = "--°C";
              document.querySelector(".humidity").innerText = "Humidity: --%";
              document.querySelector(".wind").innerText = "Wind Speed: --km/h";
              throw new Error("No weather found.");
            }
            return response.json();
          })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        //console.log(name,icon,description,temp,humidity,speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =  "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var api_key = config.GEOLOCATION_API;
      
        var api_url = 'https://api.opencagedata.com/geocode/v1/json'
      
        var request_url = api_url
          + '?'
          + 'key=' + api_key
          + '&q=' + encodeURIComponent(latitude + ',' + longitude)
          + '&pretty=1'
          + '&no_annotations=1';
      
        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);
      
        request.onload = function() {
         
          if (request.status === 200){ 
           
            var data = JSON.parse(request.responseText);
            //console.log(data.results[0]); //to get full address
            weather.fetchWeather(data.results[0].components.county);
      
          } else if (request.status <= 500){ 
                                 
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
          } else {
            console.log("server error");
          }
        };
      
        request.onerror = function() {
          console.log("unable to connect to server");        
        };
      
        request.send();  
    },
    getLocation: function () {
        function success (data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }

        if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            weather.fetchWeather("Pune");
        }
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        weather.search();
    }
});

geocode.getLocation();