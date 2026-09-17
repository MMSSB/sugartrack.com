// weather.js
const API_GEO = "https://geocoding-api.open-meteo.com/v1/search";
const API_WX = "https://api.open-meteo.com/v1/forecast";
const API_AQI = "https://air-quality-api.open-meteo.com/v1/air-quality";
const ICON_BASE = "https://raw.githubusercontent.com/basmilius/weather-icons/master/design/fill/animation-ready/";

let trendChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const searchInp = document.getElementById('locSearch');
    const searchDrop = document.getElementById('locDropdown');
    const btnGps = document.getElementById('btnGps');

    // ==========================================
    // 1. STATE MANAGEMENT (LocalStorage)
    // ==========================================
    initWeather();

    function initWeather() {
        const autoLoc = localStorage.getItem('auto_location') === 'true';
        const savedLat = localStorage.getItem('st_weather_lat');
        const savedLon = localStorage.getItem('st_weather_lon');
        const savedName = localStorage.getItem('st_weather_name');

        if (autoLoc && !savedLat) {
            getGPS();
        } else if (savedLat && savedLon && savedName) {
            loadData(savedLat, savedLon, savedName);
        } else {
            // Default Fallback
            loadData(30.0626, 31.2497, "Cairo, Egypt");
        }
    }

    function saveLoc(lat, lon, name) {
        localStorage.setItem('st_weather_lat', lat);
        localStorage.setItem('st_weather_lon', lon);
        localStorage.setItem('st_weather_name', name);
    }

    // ==========================================
    // 2. SEARCH & GPS
    // ==========================================
    let timer;
    searchInp.addEventListener('input', (e) => {
        clearTimeout(timer);
        const q = e.target.value.trim();
        if (q.length < 2) { searchDrop.classList.remove('show'); return; }
        
        // Search dropdown appears exactly below the input
        timer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_GEO}?name=${q}&count=5&language=en&format=json`);
                const data = await res.json();
                if (data.results) renderSearch(data.results);
                else searchDrop.classList.remove('show');
            } catch (err) { console.error(err); }
        }, 300);
    });

    function renderSearch(res) {
        searchDrop.innerHTML = res.map(c => `
            <div class="s-item" data-lat="${c.latitude}" data-lon="${c.longitude}" data-name="${c.name}, ${c.country}">
                <i class="ph ph-map-pin" style="color: var(--text-secondary); font-size: 1.2rem;"></i>
                <div>
                    <div style="font-weight:600; font-size:0.95rem; color: var(--text-primary);">${c.name}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary);">${c.admin1 ? c.admin1+', ' : ''}${c.country}</div>
                </div>
            </div>
        `).join('');
        searchDrop.classList.add('show');
    }

    searchDrop.addEventListener('click', (e) => {
        const item = e.target.closest('.s-item');
        if (!item) return;
        const lat = item.dataset.lat, lon = item.dataset.lon, name = item.dataset.name;
        
        searchInp.value = ''; searchDrop.classList.remove('show');
        saveLoc(lat, lon, name);
        loadData(lat, lon, name);
    });

    // Close dropdown on outside click
    document.addEventListener('click', e => { 
        if (!e.target.closest('.search-section')) searchDrop.classList.remove('show'); 
    });

    btnGps.addEventListener('click', () => {
        const ogText = btnGps.innerHTML;
        btnGps.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Locating...';
        getGPS(() => btnGps.innerHTML = ogText);
    });

    function getGPS(cb) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude, lon = pos.coords.longitude;
                saveLoc(lat, lon, "My Location");
                loadData(lat, lon, "My Location");
                if (cb) cb();
            },
            err => { alert("GPS Access Denied. Showing default."); setLoading(false); if(cb) cb(); }
        );
    }

    // ==========================================
    // 3. FETCH & RENDER DATA
    // ==========================================
    function setLoading(isLoading) {
        document.querySelectorAll('.skel-container').forEach(c => {
            isLoading ? c.classList.remove('is-loaded') : c.classList.add('is-loaded');
        });
    }

    async function loadData(lat, lon, name) {
        setLoading(true);
        
        const wxParams = `latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        const aqiParams = `latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`;

        try {
            const [wxRes, aqiRes] = await Promise.all([
                fetch(`${API_WX}?${wxParams}`).then(r => r.json()),
                fetch(`${API_AQI}?${aqiParams}`).then(r => r.json()).catch(() => ({current: {us_aqi: null}}))
            ]);

            renderHero(wxRes.current, wxRes.daily, name);
            renderMetrics(wxRes.current, wxRes.daily, aqiRes.current);
            renderHourly(wxRes.hourly);
            renderDaily(wxRes.daily);
            renderChart(wxRes.daily);

            setTimeout(() => setLoading(false), 200);
        } catch (err) {
            console.error(err); alert("Failed to fetch weather data."); setLoading(false);
        }
    }

    function renderHero(cur, daily, name) {
        document.getElementById('cName').innerText = name;
        document.getElementById('cTemp').innerText = `${Math.round(cur.temperature_2m)}°`;
        document.getElementById('cHigh').innerText = `${Math.round(daily.temperature_2m_max[0])}`;
        document.getElementById('cLow').innerText = `${Math.round(daily.temperature_2m_min[0])}`;
        
        const wx = getIcon(cur.weather_code, cur.is_day);
        document.getElementById('cDesc').innerText = wx.desc;
        document.getElementById('cIcon').src = wx.img;
    }

    function renderMetrics(cur, daily, aqi) {
        document.getElementById('mWind').innerText = `${cur.wind_speed_10m} km/h`;
        document.getElementById('mHum').innerText = `${cur.relative_humidity_2m}%`;
        document.getElementById('mPres').innerText = `${Math.round(cur.surface_pressure)}`;
        
        const uv = daily.uv_index_max[0];
        document.getElementById('mUv').innerText = uv.toFixed(1);
        
        const toTime = dStr => new Date(dStr).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
        document.getElementById('mRise').innerText = toTime(daily.sunrise[0]);
        document.getElementById('mSet').innerText = toTime(daily.sunset[0]);

        const aqiVal = aqi.us_aqi || 0;
        document.getElementById('mAqi').innerText = aqiVal;
        
        const badge = document.getElementById('mAqiBadge');
        if(aqiVal <= 50) { badge.innerText = "Good"; badge.style.background = "var(--success)"; }
        else if(aqiVal <= 100) { badge.innerText = "Moderate"; badge.style.background = "var(--warning)"; }
        else { badge.innerText = "Poor"; badge.style.background = "var(--danger)"; }
    }

    function renderHourly(hourly) {
        const strip = document.getElementById('hourlyStrip');
        const now = new Date(); now.setMinutes(0,0,0);
        let startIdx = hourly.time.findIndex(t => new Date(t) >= now);
        if(startIdx === -1) startIdx = 0;

        const next24 = hourly.time.slice(startIdx, startIdx + 24);
        
        strip.innerHTML = next24.map((t, i) => {
            const idx = startIdx + i;
            const isNow = i === 0;
            const timeStr = isNow ? "Now" : new Date(t).getHours() + ":00";
            const wx = getIcon(hourly.weather_code[idx], hourly.is_day[idx]);
            const pop = hourly.precipitation_probability[idx];
            
            return `
                <div class="h-item ${isNow ? 'active' : ''}">
                    <span style="font-size:0.85rem; font-weight:${isNow?'700':'600'}">${timeStr}</span>
                    <img src="${wx.img}" alt="wx">
                    <span style="font-weight:700; font-size:1rem;">${Math.round(hourly.temperature_2m[idx])}°</span>
                    <span style="font-size:0.75rem; color:var(--info); font-weight:600; margin-top:2px;">${pop > 0 ? pop+'%' : ''}</span>
                </div>
            `;
        }).join('');
    }

    function renderDaily(daily) {
        const list = document.getElementById('dayList');
        const minVal = Math.min(...daily.temperature_2m_min);
        const maxVal = Math.max(...daily.temperature_2m_max);
        const range = maxVal - minVal;

        list.innerHTML = daily.time.map((t, i) => {
            const day = i === 0 ? "Today" : new Date(t).toLocaleDateString('en', {weekday:'short'});
            const wx = getIcon(daily.weather_code[i], 1);
            const low = Math.round(daily.temperature_2m_min[i]);
            const high = Math.round(daily.temperature_2m_max[i]);
            
            const leftPct = ((low - minVal) / range) * 100;
            const widthPct = ((high - low) / range) * 100;

            return `
                <div class="day-row">
                    <span style="font-weight:600; font-size:0.95rem;">${day}</span>
                    <div style="display:flex; align-items:center;">
                        <img src="${wx.img}" style="width:35px; height:35px;" alt="wx">
                        <div class="d-bar-wrap">
                            <div class="d-bar" style="left:${leftPct}%; width:${widthPct}%;"></div>
                        </div>
                    </div>
                    <div style="font-weight:600; font-size:0.9rem; text-align:right;">
                        <span style="color:var(--text-secondary)">${low}°</span> / <span>${high}°</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderChart(daily) {
        const ctx = document.getElementById('miniChart').getContext('2d');
        if (trendChart) trendChart.destroy();

        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: daily.time.map(t => new Date(t).toLocaleDateString('en', {weekday:'short'})),
                datasets: [{
                    data: daily.temperature_2m_max.map(t => Math.round(t)),
                    borderColor: '#3b82f6', borderWidth: 3, tension: 0.4,
                    pointBackgroundColor: '#18181b', pointBorderColor: '#3b82f6', pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { displayColors: false, backgroundColor: '#18181b', padding: 8 } },
                scales: {
                    x: { display: false },
                    y: { display: false, min: Math.min(...daily.temperature_2m_min) - 5 }
                },
                layout: { padding: { top: 10, bottom: 5, left: 10, right: 10 } }
            }
        });
    }

    // ==========================================
    // 4. UTILS (Icon Mapper)
    // ==========================================
    function getIcon(code, isDay) {
        let name = "cloudy", desc = "Unknown";
        const dn = isDay ? "day" : "night";

        switch (code) {
            case 0: desc = "Clear"; name = `clear-${dn}`; break;
            case 1: case 2: desc = "Partly Cloudy"; name = `partly-cloudy-${dn}`; break;
            case 3: desc = "Overcast"; name = `overcast-${dn}`; break;
            case 45: case 48: desc = "Fog"; name = `fog-${dn}`; break;
            case 51: case 53: case 55: case 56: case 57: desc = "Drizzle"; name = `drizzle`; break;
            case 61: case 63: case 65: case 66: case 67: desc = "Rain"; name = `rain`; break;
            case 71: case 73: case 75: case 77: case 85: case 86: desc = "Snow"; name = `snow`; break;
            case 80: case 81: case 82: desc = "Showers"; name = `showers-${dn}`; break;
            case 95: case 96: case 99: desc = "Storms"; name = `thunderstorms-${dn}`; break;
        }
        return { desc, img: `${ICON_BASE}${name}.svg` };
    }
});