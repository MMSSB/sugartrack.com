
// document.addEventListener('DOMContentLoaded', () => {
//     // DOM Elements
//     const hamburger = document.querySelector('.hamburger');
//     const sidebar = document.querySelector('.sidebar');
//     const citySearch = document.getElementById('city-search');
//     const searchBtn = document.getElementById('search-btn');
//     const useCurrentLocationBtn = document.getElementById('use-current-location');
//     const weatherCity = document.getElementById('weather-city');
//     const lastUpdated = document.getElementById('last-updated');
//     const weatherIcon = document.getElementById('weather-icon');
//     const currentTemp = document.getElementById('current-temp');
//     const weatherDesc = document.getElementById('weather-desc');
//     const feelsLike = document.getElementById('feels-like');
//     const humidity = document.getElementById('humidity');
//     const wind = document.getElementById('wind');
//     const pressure = document.getElementById('pressure');
//     const hourlyContainer = document.getElementById('hourly-container');
//     const dailyContainer = document.getElementById('daily-container');
//     const airQualityContainer = document.getElementById('air-quality-container');
//     const currentDate = document.getElementById('current-date');
    
//     // Chart instances
//     let temperatureChart;
//     let precipitationChart;

//     // Hamburger menu toggle
//     hamburger.addEventListener('click', () => {
//         hamburger.classList.toggle('active');
//         sidebar.classList.toggle('active');
//     });

//     // Close sidebar when clicking outside on mobile
//     document.addEventListener('click', (e) => {
//         if (window.innerWidth <= 768 && 
//             !sidebar.contains(e.target) && 
//             !hamburger.contains(e.target) && 
//             sidebar.classList.contains('active')) {
//             hamburger.classList.remove('active');
//             sidebar.classList.remove('active');
//         }
//     });

//     // Update current date
//     function updateCurrentDate() {
//         const now = new Date();
//         currentDate.textContent = now.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     }
//     updateCurrentDate();

//     // Initialize charts
//     function initCharts() {
//         const tempCtx = document.getElementById('temperature-chart').getContext('2d');
//         const precipCtx = document.getElementById('precipitation-chart').getContext('2d');
        
//         temperatureChart = new Chart(tempCtx, {
//             type: 'line',
//             data: {
//                 labels: [],
//                 datasets: [
//                     {
//                         label: 'Temperature (°C)',
//                         data: [],
//                         borderColor: '#e63946',
//                         backgroundColor: 'rgba(230, 57, 70, 0.1)',
//                         tension: 0.3,
//                         fill: true
//                     },
//                     {
//                         label: 'Feels Like (°C)',
//                         data: [],
//                         borderColor: '#457b9d',
//                         backgroundColor: 'rgba(69, 123, 157, 0.1)',
//                         tension: 0.3,
//                         fill: true
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: false
//                     }
//                 }
//             }
//         });

//         precipitationChart = new Chart(precipCtx, {
//             type: 'bar',
//             data: {
//                 labels: [],
//                 datasets: [
//                     {
//                         label: 'Precipitation (mm)',
//                         data: [],
//                         backgroundColor: '#1d3557',
//                         borderColor: '#1d3557',
//                         borderWidth: 1
//                     },
//                     {
//                         label: 'Chance of Rain (%)',
//                         data: [],
//                         backgroundColor: '#a8dadc',
//                         borderColor: '#a8dadc',
//                         borderWidth: 1,
//                         type: 'line',
//                         yAxisID: 'y1'
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         title: {
//                             display: true,
//                             text: 'Precipitation (mm)'
//                         }
//                     },
//                     y1: {
//                         position: 'right',
//                         beginAtZero: true,
//                         max: 100,
//                         grid: {
//                             drawOnChartArea: false,
//                         },
//                         title: {
//                             display: true,
//                             text: 'Chance of Rain (%)'
//                         }
//                     }
//                 }
//             }
//         });
//     }
//     initCharts();

//     // Get weather data
//     async function getWeatherData(lat, lon) {
//         try {
//             // Using OpenWeatherMap API (you'll need to sign up for an API key)
//             const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your actual API key
//             const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKey}`);
//             const weatherData = await weatherResponse.json();
            
//             // For city name (using OpenWeatherMap's geocoding API)
//             const geocodeResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
//             const geocodeData = await geocodeResponse.json();
            
//             return {
//                 weather: weatherData,
//                 location: geocodeData[0]
//             };
//         } catch (error) {
//             console.error('Error fetching weather data:', error);
//             return null;
//         }
//     }

//     // Update weather UI
//     function updateWeatherUI(data) {
//         const current = data.weather.current;
//         const hourly = data.weather.hourly;
//         const daily = data.weather.daily;
        
//         // Update current weather
//         weatherCity.textContent = `${data.location.name}, ${data.location.country}`;
//         lastUpdated.textContent = `Updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
//         const weatherCode = current.weather[0].id;
//         const isDay = current.weather[0].icon.includes('d');
//         const iconPath = getWeatherIcon(weatherCode, isDay);
//         weatherIcon.innerHTML = `<img src="${iconPath}" alt="${current.weather[0].description}">`;
        
//         currentTemp.textContent = `${Math.round(current.temp)}°C`;
//         weatherDesc.textContent = current.weather[0].description;
//         feelsLike.textContent = `Feels like: ${Math.round(current.feels_like)}°C`;
//         humidity.textContent = `Humidity: ${current.humidity}%`;
//         wind.textContent = `Wind: ${Math.round(current.wind_speed * 3.6)} km/h`;
//         pressure.textContent = `Pressure: ${current.pressure} hPa`;
        
//         // Update hourly forecast
//         hourlyContainer.innerHTML = '';
//         const now = new Date();
//         const currentHour = now.getHours();
        
//         for (let i = 0; i < 24; i++) {
//             const hourData = hourly[i];
//             const hourTime = new Date(hourData.dt * 1000);
//             const hour = hourTime.getHours();
//             const hourCode = hourData.weather[0].id;
//             const hourIsDay = hourData.weather[0].icon.includes('d');
//             const hourIcon = getWeatherIcon(hourCode, hourIsDay);
            
//             const hourItem = document.createElement('div');
//             hourItem.className = 'hourly-item';
//             if (hour === currentHour) hourItem.classList.add('active');
            
//             hourItem.innerHTML = `
//                 <div class="hourly-time">${hour}:00</div>
//                 <div class="hourly-icon"><img src="${hourIcon}" alt="${hourData.weather[0].description}"></div>
//                 <div class="hourly-temp">${Math.round(hourData.temp)}°</div>
//             `;
            
//             hourlyContainer.appendChild(hourItem);
//         }
        
//         // Update daily forecast
//         dailyContainer.innerHTML = '';
//         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
//         daily.forEach((dayData, index) => {
//             const dayDate = new Date(dayData.dt * 1000);
//             const dayName = index === 0 ? 'Today' : days[dayDate.getDay()];
//             const dayCode = dayData.weather[0].id;
//             const dayIcon = getWeatherIcon(dayCode, true);
            
//             const dayItem = document.createElement('div');
//             dayItem.className = 'daily-item';
            
//             dayItem.innerHTML = `
//                 <div class="daily-day">${dayName}</div>
//                 <div class="daily-icon"><img src="${dayIcon}" alt="${dayData.weather[0].description}"></div>
//                 <div class="daily-temps">
//                     <span class="daily-high">${Math.round(dayData.temp.max)}°</span>
//                     <span class="daily-low">${Math.round(dayData.temp.min)}°</span>
//                 </div>
//             `;
            
//             dailyContainer.appendChild(dayItem);
//         });
        
//         // Update charts
//         updateCharts(data.weather.hourly);
        
//         // Update air quality
//         updateAirQuality(data.weather.current);
//     }
    
//     // Update charts with hourly data
//     function updateCharts(hourlyData) {
//         const hours = [];
//         const temps = [];
//         const feelsLikeTemps = [];
//         const precip = [];
//         const pop = [];
        
//         // Get next 24 hours data
//         for (let i = 0; i < 24; i++) {
//             const hourData = hourlyData[i];
//             const hourTime = new Date(hourData.dt * 1000);
//             hours.push(hourTime.getHours() + ':00');
//             temps.push(Math.round(hourData.temp));
//             feelsLikeTemps.push(Math.round(hourData.feels_like));
//             precip.push(hourData.rain ? hourData.rain['1h'] || 0 : 0);
//             pop.push(Math.round(hourData.pop * 100));
//         }
        
//         // Update temperature chart
//         temperatureChart.data.labels = hours;
//         temperatureChart.data.datasets[0].data = temps;
//         temperatureChart.data.datasets[1].data = feelsLikeTemps;
//         temperatureChart.update();
        
//         // Update precipitation chart
//         precipitationChart.data.labels = hours;
//         precipitationChart.data.datasets[0].data = precip;
//         precipitationChart.data.datasets[1].data = pop;
//         precipitationChart.update();
//     }
    
//     // Update air quality
//     function updateAirQuality(currentData) {
//         if (!currentData.air_quality) {
//             airQualityContainer.innerHTML = '<p>Air quality data not available for this location.</p>';
//             return;
//         }
        
//         const aqi = currentData.air_quality['us-epa-index'] || 0;
//         const { pm2_5, pm10, no2, so2, o3, co } = currentData.air_quality;
        
//         let aqiLevel, aqiDescription;
        
//         switch(aqi) {
//             case 1:
//                 aqiLevel = 'Good';
//                 aqiDescription = 'Air quality is satisfactory, and air pollution poses little or no risk.';
//                 break;
//             case 2:
//                 aqiLevel = 'Moderate';
//                 aqiDescription = 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
//                 break;
//             case 3:
//                 aqiLevel = 'Unhealthy for Sensitive Groups';
//                 aqiDescription = 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
//                 break;
//             case 4:
//                 aqiLevel = 'Unhealthy';
//                 aqiDescription = 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
//                 break;
//             case 5:
//                 aqiLevel = 'Very Unhealthy';
//                 aqiDescription = 'Health alert: The risk of health effects is increased for everyone.';
//                 break;
//             case 6:
//                 aqiLevel = 'Hazardous';
//                 aqiDescription = 'Health warning of emergency conditions: everyone is more likely to be affected.';
//                 break;
//             default:
//                 aqiLevel = 'Unknown';
//                 aqiDescription = 'Air quality data is not available or could not be interpreted.';
//         }
        
//         airQualityContainer.innerHTML = `
//             <div class="aqi-value">${aqi}</div>
//             <div class="aqi-level">${aqiLevel}</div>
//             <div class="aqi-description">${aqiDescription}</div>
//             <div class="aqi-components">
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">PM2.5</span>
//                     <span class="aqi-component-value">${pm2_5.toFixed(1)} µg/m³</span>
//                 </div>
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">PM10</span>
//                     <span class="aqi-component-value">${pm10.toFixed(1)} µg/m³</span>
//                 </div>
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">NO₂</span>
//                     <span class="aqi-component-value">${no2.toFixed(1)} µg/m³</span>
//                 </div>
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">SO₂</span>
//                     <span class="aqi-component-value">${so2.toFixed(1)} µg/m³</span>
//                 </div>
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">O₃</span>
//                     <span class="aqi-component-value">${o3.toFixed(1)} µg/m³</span>
//                 </div>
//                 <div class="aqi-component">
//                     <span class="aqi-component-name">CO</span>
//                     <span class="aqi-component-value">${co.toFixed(1)} µg/m³</span>
//                 </div>
//             </div>
//         `;
//     }
    
//     // Get weather icon based on weather code
//     function getWeatherIcon(code, isDay) {
//         // Weather icon mapping based on OpenWeatherMap codes
//         // Using Erik Flowers' Weather Icons: https://erikflowers.github.io/weather-icons/
//         const prefix = 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons@d558c1b/svg/';
        
//         if (code >= 200 && code < 300) {
//             return prefix + 'wi-thunderstorm.svg';
//         } else if (code >= 300 && code < 400) {
//             return prefix + 'wi-sprinkle.svg';
//         } else if (code >= 500 && code < 600) {
//             return prefix + (isDay ? 'wi-day-rain.svg' : 'wi-night-alt-rain.svg');
//         } else if (code >= 600 && code < 700) {
//             return prefix + 'wi-snow.svg';
//         } else if (code >= 700 && code < 800) {
//             return prefix + 'wi-fog.svg';
//         } else if (code === 800) {
//             return prefix + (isDay ? 'wi-day-sunny.svg' : 'wi-night-clear.svg');
//         } else if (code === 801) {
//             return prefix + (isDay ? 'wi-day-cloudy.svg' : 'wi-night-alt-cloudy.svg');
//         } else if (code === 802) {
//             return prefix + 'wi-cloud.svg';
//         } else if (code === 803 || code === 804) {
//             return prefix + 'wi-cloudy.svg';
//         } else {
//             return prefix + 'wi-na.svg';
//         }
//     }
    
//     // Search for city weather
//     async function searchCityWeather(cityName) {
//         try {
//             const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your actual API key
//             const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
//             const data = await response.json();
            
//             if (data.length > 0) {
//                 const weatherData = await getWeatherData(data[0].lat, data[0].lon);
//                 if (weatherData) {
//                     updateWeatherUI(weatherData);
//                 }
//             } else {
//                 alert('City not found. Please try another location.');
//             }
//         } catch (error) {
//             console.error('Error searching for city:', error);
//             alert('Error fetching weather data. Please try again.');
//         }
//     }
    
//     // Event listeners
//     searchBtn.addEventListener('click', () => {
//         if (citySearch.value.trim()) {
//             searchCityWeather(citySearch.value.trim());
//         }
//     });
    
//     citySearch.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter' && citySearch.value.trim()) {
//             searchCityWeather(citySearch.value.trim());
//         }
//     });
    
//     useCurrentLocationBtn.addEventListener('click', () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(async (position) => {
//                 const weatherData = await getWeatherData(position.coords.latitude, position.coords.longitude);
//                 if (weatherData) {
//                     updateWeatherUI(weatherData);
//                 }
//             }, (error) => {
//                 alert('Unable to retrieve your location. Please enable location services or search for a city manually.');
//             });
//         } else {
//             alert('Geolocation is not supported by your browser. Please search for a city manually.');
//         }
//     });
    
//     // Load default weather (London)
//     async function loadDefaultWeather() {
//         const defaultWeather = await getWeatherData(51.5074, -0.1278); // London coordinates
//         if (defaultWeather) {
//             updateWeatherUI(defaultWeather);
//         }
//     }
//     loadDefaultWeather();
// });


document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const citySearch = document.getElementById('city-search');
    const searchBtn = document.getElementById('search-btn');
    const useCurrentLocationBtn = document.getElementById('use-current-location');
    const weatherCity = document.getElementById('weather-city');
    const lastUpdated = document.getElementById('last-updated');
    const weatherIcon = document.getElementById('weather-icon');
    const currentTemp = document.getElementById('current-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const hourlyContainer = document.getElementById('hourly-container');
    const dailyContainer = document.getElementById('daily-container');
    const airQualityContainer = document.getElementById('air-quality-container');
    const currentDate = document.getElementById('current-date');
    
    // Chart instances
    let temperatureChart;
    let precipitationChart;

    // // Hamburger menu toggle
    // hamburger.addEventListener('click', () => {
    //     hamburger.classList.toggle('active');
    //     sidebar.classList.toggle('active');
    // });

    // // Close sidebar when clicking outside on mobile
    // document.addEventListener('click', (e) => {
    //     if (window.innerWidth <= 768 && 
    //         !sidebar.contains(e.target) && 
    //         !hamburger.contains(e.target) && 
    //         sidebar.classList.contains('active')) {
    //         hamburger.classList.remove('active');
    //         sidebar.classList.remove('active');
    //     }
    // });

    // // Update current date
    // function updateCurrentDate() {
    //     const now = new Date();
    //     currentDate.textContent = now.toLocaleDateString('en-US', {
    //         weekday: 'long',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric'
    //     });
    // }
    // updateCurrentDate();

    // Initialize charts
    function initCharts() {
        const tempCtx = document.getElementById('temperature-chart').getContext('2d');
        const precipCtx = document.getElementById('precipitation-chart').getContext('2d');
        
        temperatureChart = new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: [],
                        borderColor: '#e63946',
                        backgroundColor: 'rgba(230, 57, 70, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Feels Like (°C)',
                        data: [],
                        borderColor: '#457b9d',
                        backgroundColor: 'rgba(69, 123, 157, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: false } }
            }
        });

        precipitationChart = new Chart(precipCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Precipitation (mm)',
                        data: [],
                        backgroundColor: '#1d3557',
                        borderColor: '#1d3557',
                        borderWidth: 1
                    },
                    {
                        label: 'Chance of Rain (%)',
                        data: [],
                        backgroundColor: '#a8dadc',
                        borderColor: '#a8dadc',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Precipitation (mm)' }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Chance of Rain (%)' }
                    }
                }
            }
        });
    }
    initCharts();

    // Main function to fetch all data for a given location
    async function fetchAndDisplayWeather(lat, lon, locationName = null) {
        try {
            // 1. Get Weather and Air Quality Data
            const weatherParams = 'current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,weathercode,surface_pressure,windspeed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto';
            const weatherResponse = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${weatherParams}`);
            
            const airQualityParams = 'current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone';
            const airQualityResponse = fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&${airQualityParams}`);

            // 2. Get Location Name (if not provided)
            let locationResponse;
            if (!locationName) {
                // Using Nominatim for reliable reverse geocoding
                locationResponse = fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
                    headers: { 'User-Agent': 'PrayTime-Weather-App' } // Nominatim requires a User-Agent
                });
            }

            // 3. Await all promises
            const [weatherRes, airQualityRes, locRes] = await Promise.all([weatherResponse, airQualityResponse, locationResponse]);

            if (!weatherRes.ok || !airQualityRes.ok) {
                throw new Error('Failed to fetch weather or air quality data.');
            }

            const weatherData = await weatherRes.json();
            const airQualityData = await airQualityRes.json();
            let finalLocation;

            if (locationName) {
                finalLocation = locationName;
            } else {
                if (!locRes.ok) throw new Error('Failed to fetch location name.');
                const geocodeData = await locRes.json();
                finalLocation = {
                    name: geocodeData.address.city || geocodeData.address.town || geocodeData.address.village || 'Unknown Location',
                    country: geocodeData.address.country
                };
            }

            // 4. Update UI with all the data
            updateWeatherUI({
                weather: weatherData,
                airQuality: airQualityData,
                location: finalLocation
            });

        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. The service might be temporarily down or the location is invalid. Please try again later.');
            return null;
        }
    }

    // Update weather UI
    function updateWeatherUI(data) {
        const { weather, airQuality, location } = data;
        const current = weather.current;
        const hourly = weather.hourly;
        const daily = weather.daily;

        // Update current weather
        weatherCity.textContent = `${location.name}, ${location.country}`;
        lastUpdated.textContent = `Updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        const { description, iconPath } = getWeatherIcon(current.weathercode, current.is_day);
        weatherIcon.innerHTML = `<img src="${iconPath}" alt="${description}">`;
        
        currentTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
        weatherDesc.textContent = description;
        feelsLike.textContent = `Feels like: ${Math.round(current.apparent_temperature)}°C`;
        humidity.textContent = `Humidity: ${current.relativehumidity_2m}%`;
        wind.textContent = `Wind: ${Math.round(current.windspeed_10m)} km/h`;
        pressure.textContent = `Pressure: ${Math.round(current.surface_pressure)} hPa`;
        
        // Update hourly forecast
        hourlyContainer.innerHTML = '';
        const currentHour = new Date().getHours();
        for (let i = 0; i < 24; i++) {
            const hourTime = new Date(hourly.time[i]);
            const hour = hourTime.getHours();
            // Using is_day from the API for accuracy
            const { description: hourDesc, iconPath: hourIcon } = getWeatherIcon(hourly.weathercode[i], hourly.is_day[i]);

            const hourItem = document.createElement('div');
            hourItem.className = 'hourly-item';
            if (hour === currentHour) hourItem.classList.add('active');
            
            hourItem.innerHTML = `
                <div class="hourly-time">${hour}:00</div>
                <div class="hourly-icon"><img src="${hourIcon}" alt="${hourDesc}"></div>
                <div class="hourly-temp">${Math.round(hourly.temperature_2m[i])}°</div>
            `;
            hourlyContainer.appendChild(hourItem);
        }
        
        // Update daily forecast
        dailyContainer.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daily.time.forEach((day, index) => {
            const dayDate = new Date(day);
            const dayName = index === 0 ? 'Today' : days[dayDate.getUTCDay()];
            const { description: dayDesc, iconPath: dayIcon } = getWeatherIcon(daily.weathercode[index], true); // Daily is always 'day' icon

            const dayItem = document.createElement('div');
            dayItem.className = 'daily-item';
            
            dayItem.innerHTML = `
                <div class="daily-day">${dayName}</div>
                <div class="daily-icon"><img src="${dayIcon}" alt="${dayDesc}"></div>
                <div class="daily-temps">
                    <span class="daily-high">${Math.round(daily.temperature_2m_max[index])}°</span>
                    <span class="daily-low">${Math.round(daily.temperature_2m_min[index])}°</span>
                </div>
            `;
            dailyContainer.appendChild(dayItem);
        });
        
        updateCharts(hourly);
        updateAirQuality(airQuality.current);
    }
    
    // Update charts with hourly data
    function updateCharts(hourlyData) {
        const hours = hourlyData.time.slice(0, 24).map(t => new Date(t).getHours() + ':00');
        const temps = hourlyData.temperature_2m.slice(0, 24).map(Math.round);
        const feelsLikeTemps = hourlyData.apparent_temperature.slice(0, 24).map(Math.round);
        const precip = hourlyData.precipitation.slice(0, 24);
        const pop = hourlyData.precipitation_probability.slice(0, 24);

        temperatureChart.data.labels = hours;
        temperatureChart.data.datasets[0].data = temps;
        temperatureChart.data.datasets[1].data = feelsLikeTemps;
        temperatureChart.update();
        
        precipitationChart.data.labels = hours;
        precipitationChart.data.datasets[0].data = precip;
        precipitationChart.data.datasets[1].data = pop;
        precipitationChart.update();
    }
    
    // Update air quality
    function updateAirQuality(airQualityData) {
        if (!airQualityData || airQualityData.us_aqi === null) {
            airQualityContainer.innerHTML = '<p>Air quality data not available for this location.</p>';
            return;
        }
        
        const aqi = Math.round(airQualityData.us_aqi);
        const { pm2_5, pm10, nitrogen_dioxide, sulphur_dioxide, ozone, carbon_monoxide } = airQualityData;
        
        let aqiLevel, aqiDescription;
        if (aqi <= 50) { aqiLevel = 'Good'; aqiDescription = 'Air quality is satisfactory, and air pollution poses little or no risk.'; } 
        else if (aqi <= 100) { aqiLevel = 'Moderate'; aqiDescription = 'Air quality is acceptable. However, there may be a risk for some people.'; } 
        else if (aqi <= 150) { aqiLevel = 'Unhealthy for Sensitive Groups'; aqiDescription = 'Members of sensitive groups may experience health effects.'; }
        else if (aqi <= 200) { aqiLevel = 'Unhealthy'; aqiDescription = 'Some members of the general public may experience health effects.'; }
        else if (aqi <= 300) { aqiLevel = 'Very Unhealthy'; aqiDescription = 'Health alert: The risk of health effects is increased for everyone.'; }
        else { aqiLevel = 'Hazardous'; aqiDescription = 'Health warning of emergency conditions: everyone is more likely to be affected.'; }
        
        airQualityContainer.innerHTML = `
            <div class="aqi-value" style="color: ${aqi <= 50 ? '#28a745' : aqi <= 100 ? '#ffc107' : '#dc3545'};">${aqi}</div>
            <div class="aqi-level">${aqiLevel}</div>
            <div class="aqi-description">${aqiDescription}</div>
            <div class="aqi-components">
                ${pm2_5 ? `<div class="aqi-component"><span class="aqi-component-name">PM2.5</span><span class="aqi-component-value">${pm2_5.toFixed(1)} µg/m³</span></div>` : ''}
                ${pm10 ? `<div class="aqi-component"><span class="aqi-component-name">PM10</span><span class="aqi-component-value">${pm10.toFixed(1)} µg/m³</span></div>` : ''}
                ${nitrogen_dioxide ? `<div class="aqi-component"><span class="aqi-component-name">NO₂</span><span class="aqi-component-value">${nitrogen_dioxide.toFixed(1)} µg/m³</span></div>` : ''}
                ${sulphur_dioxide ? `<div class="aqi-component"><span class="aqi-component-name">SO₂</span><span class="aqi-component-value">${sulphur_dioxide.toFixed(1)} µg/m³</span></div>` : ''}
                ${ozone ? `<div class="aqi-component"><span class="aqi-component-name">O₃</span><span class="aqi-component-value">${ozone.toFixed(1)} µg/m³</span></div>` : ''}
                ${carbon_monoxide ? `<div class="aqi-component"><span class="aqi-component-name">CO</span><span class="aqi-component-value">${carbon_monoxide.toFixed(1)} µg/m³</span></div>` : ''}
            </div>
        `;
    }
    
    // Get weather icon and description from WMO code
    function getWeatherIcon(code, isDay) {
        // const prefix = 'https://cdn.jsdelivr.net/gh/erikflowers/weather-icons@d558c1b/svg/';
        // AFTER
const prefix = 'svg/';
        let iconName, description;
        
        switch (code) {
            case 0: description = 'Clear sky'; iconName = isDay ? 'wi-day-sunny.svg' : 'wi-night-clear.svg'; break;
            case 1: description = 'Mainly clear'; iconName = isDay ? 'wi-day-sunny-overcast.svg' : 'wi-night-alt-partly-cloudy.svg'; break;
            case 2: description = 'Partly cloudy'; iconName = isDay ? 'wi-day-cloudy.svg' : 'wi-night-alt-cloudy.svg'; break;
            case 3: description = 'Overcast'; iconName = 'wi-cloudy.svg'; break;
            case 45: case 48: description = 'Fog'; iconName = 'wi-fog.svg'; break;
            case 51: case 53: case 55: description = 'Drizzle'; iconName = 'wi-sprinkle.svg'; break;
            case 56: case 57: description = 'Freezing Drizzle'; iconName = 'wi-rain-mix.svg'; break;
            case 61: case 63: case 65: description = 'Rain'; iconName = 'wi-rain.svg'; break;
            case 66: case 67: description = 'Freezing Rain'; iconName = 'wi-sleet.svg'; break;
            case 71: case 73: case 75: description = 'Snow fall'; iconName = 'wi-snow.svg'; break;
            case 77: description = 'Snow grains'; iconName = 'wi-snow.svg'; break;
            case 80: case 81: case 82: description = 'Rain showers'; iconName = 'wi-showers.svg'; break;
            case 85: case 86: description = 'Snow showers'; iconName = 'wi-snow.svg'; break;
            case 95: description = 'Thunderstorm'; iconName = 'wi-thunderstorm.svg'; break;
            case 96: case 99: description = 'Thunderstorm with hail'; iconName = 'wi-storm-showers.svg'; break;
            default: description = 'Unknown'; iconName = 'wi-na.svg'; break;
        }
        return { description, iconPath: prefix + iconName };
    }
    
    // Search for city weather
    async function searchCityWeather(cityName) {
        try {
            // Using Open-Meteo's reliable geocoding API
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const city = data.results[0];
                const locationName = { name: city.name, country: city.country };
                fetchAndDisplayWeather(city.latitude, city.longitude, locationName);
            } else {
                alert('City not found. Please try another location.');
            }
        } catch (error) {
            console.error('Error searching for city:', error);
            alert('Error fetching city data. Please try again.');
        }
    }
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        if (citySearch.value.trim()) {
            searchCityWeather(citySearch.value.trim());
        }
    });
    
    citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && citySearch.value.trim()) {
            searchCityWeather(citySearch.value.trim());
        }
    });
    
    useCurrentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchAndDisplayWeather(position.coords.latitude, position.coords.longitude),
                (error) => alert('Unable to retrieve your location. Please enable location services or search for a city manually.')
            );
        } else {
            alert('Geolocation is not supported by your browser. Please search for a city manually.');
        }
    });
    
    // Initial load: Try to use current location, fall back to a default (Cairo)
    function initializeWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchAndDisplayWeather(position.coords.latitude, position.coords.longitude),
                (error) => {
                    console.log("User denied geolocation or it failed. Loading default location.");
                    fetchAndDisplayWeather(30.0444, 31.2357, { name: 'Cairo', country: 'Egypt' }); // Default to Cairo
                }
            );
        } else {
            console.log("Geolocation not supported. Loading default location.");
            fetchAndDisplayWeather(30.0444, 31.2357, { name: 'Cairo', country: 'Egypt' }); // Default to Cairo
        }
    }
    
    initializeWeather();
});