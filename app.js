// --- CONFIGURACIÓN PRINCIPAL DE LA API ---

const API_KEY = "YOUR-API-KEY-HERE"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Aquí todo lo relacionado a POO 

class Clima {
  constructor(data) {
    this.ciudad = data.name;
    this.pais = data.sys.country;
    this.temp = Math.round(data.main.temp);
    this.humedad = data.main.humidity;
    this.viento = Math.round(data.wind.speed);
    this.descripcion = data.weather[0].description;
    this.climaPrincipal = data.weather[0].main; 
  }

  // Todos los .SVG de los iconos para el clima

  iconoFondo() {
    switch (this.climaPrincipal) {
      case 'Clear': // Sol
        return `
          <svg class="weather-icon-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        `;
      case 'Clouds': // Nubes
        return `
          <svg class="weather-icon-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.72-1.95-2.67-3.5-5-3.5a5 5 0 0 0-5 5c-1.39 0-2.5 1.11-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5h11.5Z"/></svg>
        `;
      case 'Rain':
      case 'Drizzle': // Lluvia
        return `
          <svg class="weather-icon-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6M8 14v6M12 16v6"/></svg>
        `;
      case 'Thunderstorm': // Tormenta
        return `
          <svg class="weather-icon-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.72-1.95-2.67-3.5-5-3.5a5 5 0 0 0-5 5c-1.39 0-2.5 1.11-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5h11.5Z"/><path d="m13 11-3 5h5l-3 5"/></svg>
        `;
      default: // Nieve, niebla, etc
        return `
          <svg class="weather-icon-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><path d="M4.14 15.111A5 5 0 1 1 14.89 10h.61a3.5 3.5 0 0 1 1 6.857"/></svg>
        `;
    }
  }

  // Aquí vamos a generar la estructura de la tarjeta del clima y vamos a obtener datos de la API

generarHTML() {
    return `
      <div class="weather-card">
        <h2 class="city-name">${this.ciudad}, ${this.pais}</h2>
        <div class="temp">${this.temp}°C</div>
        
        <div class="desc-container">
          <span class="desc">${this.descripcion}</span>
          ${this.iconoFondo()} 
        </div>

        <div class="details">
          <div class="details-item">
            <span>Humedad</span>
            <strong>${this.humedad}%</strong>
          </div>
          <div class="details-item">
            <span>Viento</span>
            <strong>${this.viento} m/s</strong>
          </div>
        </div>
      </div>
    `;
  }
}

// --- ASINCRONÍA Y GESTIÓN DE DATOS (fetch y async-await) ---

async function obtenerClima(ciudad) {
  const contenedor = document.getElementById("weather-container");
  
try {
    const response = await fetch(`${BASE_URL}?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`);
    
    if (!response.ok) throw new Error("Ciudad no encontrada");

    const data = await response.json();
    const climaInfo = new Clima(data);
    
    contenedor.innerHTML = climaInfo.generarHTML();
    
    localStorage.setItem("ultimaCiudad", data.name);

  } catch (error) {
    contenedor.innerHTML = `<div class="error">⚠️ ${error.message}</div>`;
  }
}

// --- FILTRADO Y BUSCADOR ---

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ciudadBuscada = document.getElementById("search-input").value.trim();
  if (ciudadBuscada) obtenerClima(ciudadBuscada);
});

const ciudadInicial = localStorage.getItem("ultimaCiudad") || "Madrid";
obtenerClima(ciudadInicial);


// --- GESTIÓN DEL MODO CLARO / OSCURO ---

const themeToggle = document.querySelector(".theme-toggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    
    if (document.body.classList.contains("light-mode")) {
      themeToggle.textContent = "☀️"; 
      localStorage.setItem("theme", "light"); 
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "dark");  
    }
  });
}