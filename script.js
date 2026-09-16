document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('city-search');
  const autocompleteList = document.getElementById('autocomplete-list');
  const currentWeatherSection = document.getElementById('current-weather');
  const cityNameEl = document.getElementById('city-name');
  const tempEl = document.getElementById('temperature');
  const iconEl = document.getElementById('weather-icon');
  const descEl = document.getElementById('weather-description');
  const humidityEl = document.getElementById('humidity');
  const windEl = document.getElementById('wind-speed');
  const forecastSection = document.getElementById('forecast-section');
  const forecastContainer = document.getElementById('forecast-container');
  const recentSearchesSection = document.getElementById('recent-searches');
  const recentListEl = document.getElementById('recent-list');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-message');

  let debounceTimer;
  const RECENT_SEARCHES_KEY = 'weather_recent_searches';

  const weatherCodes = {
    0: { desc: 'Clear sky', icon: '☀️', type: 'clear' },
    1: { desc: 'Mainly clear', icon: '🌤️', type: 'clear' },
    2: { desc: 'Partly cloudy', icon: '⛅', type: 'cloudy' },
    3: { desc: 'Overcast', icon: '☁️', type: 'cloudy' },
    45: { desc: 'Fog', icon: '🌫️', type: 'cloudy' },
    48: { desc: 'Depositing rime fog', icon: '🌫️', type: 'cloudy' },
    51: { desc: 'Light drizzle', icon: '🌦️', type: 'rain' },
    53: { desc: 'Moderate drizzle', icon: '🌦️', type: 'rain' },
    55: { desc: 'Dense drizzle', icon: '🌧️', type: 'rain' },
    61: { desc: 'Slight rain', icon: '🌧️', type: 'rain' },
    63: { desc: 'Moderate rain', icon: '🌧️', type: 'rain' },
    65: { desc: 'Heavy rain', icon: '🌧️', type: 'rain' },
    71: { desc: 'Slight snow', icon: '🌨️', type: 'snow' },
    73: { desc: 'Moderate snow', icon: '❄️', type: 'snow' },
    75: { desc: 'Heavy snow', icon: '❄️', type: 'snow' },
    80: { desc: 'Slight rain showers', icon: '🌦️', type: 'rain' },
    81: { desc: 'Moderate rain showers', icon: '🌧️', type: 'rain' },
    82: { desc: 'Violent rain showers', icon: '⛈️', type: 'rain' },
    95: { desc: 'Thunderstorm', icon: '⛈️', type: 'storm' },
    96: { desc: 'Thunderstorm with slight hail', icon: '⛈️', type: 'storm' },
    99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️', type: 'storm' }
  };

  function getWeatherInfo(code) {
    return weatherCodes[code] || { desc: 'Unknown', icon: '❓', type: 'cloudy' };
  }

  function showLoading() {
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
  }

  function hideLoading() {
    loadingEl.classList.add('hidden');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
    hideLoading();
  }

  function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    searches = searches.filter(c => c.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    if (searches.length > 5) searches.pop();
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    renderRecentSearches();
  }

  function renderRecentSearches() {
    const searches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    recentListEl.innerHTML = '';
    if (searches.length === 0) {
      recentSearchesSection.classList.add('hidden');
      return;
    }
    recentSearchesSection.classList.remove('hidden');
    searches.forEach(city => {
      const btn = document.createElement('div');
      btn.className = 'recent-item';
      btn.textContent = city;
      btn.addEventListener('click', () => fetchWeather(city));
      recentListEl.appendChild(btn);
    });
  }

  async function fetchAutocomplete(query) {
    if (!query || query.length < 3) {
      autocompleteList.innerHTML = '';
      autocompleteList.classList.add('hidden');
      return;
    }
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      const data = await res.json();
      autocompleteList.innerHTML = '';
      if (!data.results || data.results.length === 0) {
        autocompleteList.classList.add('hidden');
        return;
      }
      data.results.forEach(place => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = `${place.name}, ${place.country || ''}`;
        item.addEventListener('click', () => {
          searchInput.value = place.name;
          autocompleteList.classList.add('hidden');
          fetchWeather(place.name);
        });
        autocompleteList.appendChild(item);
      });
      autocompleteList.classList.remove('hidden');
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  }

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchAutocomplete(e.target.value), 300);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();
      if (query) fetchWeather(query);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      autocompleteList.classList.add('hidden');
    }
  });

  async function fetchWeather(city) {
    showLoading();
    currentWeatherSection.classList.add('hidden');
    forecastSection.classList.add('hidden');
    autocompleteList.classList.add('hidden');

    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const place = geoData.results[0];
      const { latitude, longitude, name, country } = place;
      const displayName = `${name}, ${country}`;

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`);
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const daily = weatherData.daily;

      cityNameEl.textContent = displayName;
      tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
      const weatherInfo = getWeatherInfo(current.weather_code);
      iconEl.textContent = weatherInfo.icon;
      descEl.textContent = weatherInfo.desc;
      humidityEl.textContent = `${current.relative_humidity_2m}%`;
      windEl.textContent = `${current.wind_speed_10m} km/h`;
      currentWeatherSection.classList.remove('hidden');

      forecastContainer.innerHTML = '';
      for (let i = 1; i < 6; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const code = daily.weather_code[i];
        const info = getWeatherInfo(code);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
          <div class="forecast-day">${dayName}</div>
          <div class="forecast-icon">${info.icon}</div>
          <div class="forecast-temps">
            <span class="high">${maxTemp}°</span>
            <span class="low">${minTemp}°</span>
          </div>
        `;
        forecastContainer.appendChild(card);
      }
      forecastSection.classList.remove('hidden');

      document.body.className = `weather-${weatherInfo.type}`;
      saveRecentSearch(displayName);
      hideLoading();

    } catch (err) {
      showError(err.message || 'Failed to fetch weather data');
    }
  }

  renderRecentSearches();
});