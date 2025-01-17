// API call to fetch weather data for a given location
async function getWeatherData(location) {
  try {
    // Show loader and hide weather card while fetching data
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("weatherCard").classList.add("hidden");

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
  } finally {
    // Hide loader regardless of success or failure
    document.getElementById("loader").classList.add("hidden");
  }
}

// Process raw weather data into a more manageable format
function processWeatherData(data) {
  // Validate data structure
  if (!data || !data.days || data.days.length === 0) {
    throw new Error("Invalid data format or missing 'days' array.");
  }

  const today = data.days[0];

  // Return only the required data in a structured format
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

// Update the UI with weather data
function displayWeatherData(data) {
  // Show the weather card
  document.getElementById("weatherCard").classList.remove("hidden");

  // Update location and date
  document.getElementById("location").textContent = data.location;
  document.getElementById("date").textContent = new Date(
    data.date
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Update temperature information
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

  // Update other weather details
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("sunrise").textContent = data.sunrise;
  document.getElementById("sunset").textContent = data.sunset;
  document.getElementById("weatherConditions").textContent = data.conditions;

  // Map API weather icons to Font Awesome icons
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

  // Update weather icon
  const iconClass = iconMap[data.icon] || "fa-cloud";
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.className = `fas ${iconClass}`;
}

// Event Listeners
document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const location = document.getElementById("locationInput").value;
  if (location) {
    getWeatherData(location);
  }
});

// Set current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();
