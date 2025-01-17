async function getWeatherData() {
    const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?unitGroup=metric&key=3JHN77AKRQR6DKSWU72S8WJXU&contentType=json");
    const weatherData = await response.json();
    const processedData = processWeatherData(weatherData);
    console.log(processedData);
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
            min: today.tempmin,
        },
        conditions: today.conditions,
        wind: `${today.windspeed} km/h`,
        humidity: `${today.humidity}%`,
        sunrise: today.sunrise,
        sunset: today.sunset,
        icon: today.icon 
    };
}

getWeatherData();
