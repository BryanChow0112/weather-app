async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        location
      )}?unitGroup=metric&key=3JHN77AKRQR6DKSWU72S8WJXU&contentType=json`
    );
    const weatherData = await response.json();
    const processedData = processWeatherData(weatherData);
    displayWeatherData(processedData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again.");
  }
}

function processWeatherData(data) {
  if (!data || !data.days || data.days.length === 0) {
    throw new Error("Invalid data format or missing 'days' array.");
  }

  const today = data.days[0];

  return {
    location: data.resolvedAddress,
    date: today.datetime,
    temperature: {
      current: today.temp,
      feelsLike: today.feelslike,
      max: today.tempmax,
      min: today.tempmin
    },
    conditions: today.conditions,
    wind: `${today.windspeed} km/h`,
    humidity: `${today.humidity}%`,
    sunrise: today.sunrise,
    sunset: today.sunset,
    icon: today.icon
  };
}

function displayWeatherData(data) {
  document.getElementById("weatherCard").classList.remove("hidden");
  document.getElementById("location").textContent = data.location;
  document.getElementById("date").textContent = new Date(
    data.date
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  document.getElementById("currentTemp").textContent = `${Math.round(
    data.temperature.current
  )}°C`;
  document.getElementById("feelsLike").textContent = `Feels like ${Math.round(
    data.temperature.feelsLike
  )}°C`;
  document.getElementById("tempMax").textContent = `${Math.round(
    data.temperature.max
  )}°C`;
  document.getElementById("tempMin").textContent = `${Math.round(
    data.temperature.min
  )}°C`;
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("sunrise").textContent = data.sunrise;
  document.getElementById("sunset").textContent = data.sunset;
  document.getElementById("weatherConditions").textContent = data.conditions;

  // Map weather icon to Font Awesome icons
  const iconMap = {
    "clear-day": "fa-sun",
    "partly-cloudy-day": "fa-cloud-sun",
    "cloudy": "fa-cloud",
    "rain": "fa-cloud-rain",
    "snow": "fa-snowflake",
    "wind": "fa-wind",
    "fog": "fa-smog",
    "thunder-rain": "fa-bolt"
  };

  const iconClass = iconMap[data.icon] || "fa-cloud";
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.className = `fas ${iconClass}`;
}

document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const location = document.getElementById("locationInput").value;
  if (location) {
    getWeatherData(location);
  }
});
