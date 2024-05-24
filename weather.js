function weather() {
  // Obter a cidade digitada pelo usuário
  let city = document.querySelector("#weather").value;
  // Constroe a URL da API para buscar dados climáticos para a cidade fornecida
  const url = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8b829cb8dbb712898c23f08fd4a4b603&lang=pt_br`);

  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      if (res.cod !== 200) {
        error1(res);
      } else {
        console.log(res);
        getMoonPhase(res.coord.lat, res.coord.lon).then(moonPhase => {
          show(res, moonPhase);
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function show(el, moonPhase) {
  let box = document.createElement("div");
  box.style.zIndex = 11;
  box.style.position = "fixed";
  box.style.margin = "170px 0px 0px 5px";
  box.style.backgroundColor = "white";
  box.style.border = "1px solid rgb(153, 153, 153)";
  box.style.padding = "25px";
  box.style.borderRadius = "5px";
  box.style.width = "228px";
  box.style.height = "384px";
  box.style.lineHeight = 1;

  let name = document.createElement("h2");
  name.innerText = el.name;

  let date = document.createElement("p");
  let dateObj = new Date(el.dt * 1000);
  let options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  let dateStr = dateObj.toLocaleDateString("pt-BR", options);
  date.innerText = `Data: ${dateStr}`;

  let description = document.createElement("p");
  description.innerText = `Clima atual: ${el.weather[0].description}`;

  let icon = document.createElement("img");
  icon.src = `http://openweathermap.org/img/w/${el.weather[0].icon}.png`;
  icon.style.width = "50px";
  icon.style.height = "50px";
  icon.style.marginRight = "10px";

  let temp = document.createElement("p");
  temp.innerText = `Temperatura atual : ${Math.round(el.main.feels_like - 273.15)}°C`;

  let max = document.createElement("p");
  max.innerText = `Máxima : ${Math.round(el.main.temp_max - 273.15)}°C`;

  let min = document.createElement("p");
  min.innerText = `Mínima : ${Math.round(el.main.temp_min - 273.15)}°C`;

  let humidity = document.createElement("p");
  humidity.innerText = `Umidade: ${el.main.humidity}%`;

  let wind = document.createElement("p");
  wind.innerText = `Vento: ${Math.round(el.wind.speed * 3.6)}km/h`;

  let clouds = document.createElement("p");
  clouds.innerText = `Nuvens : ${el.clouds.all}%`;

  let precipitation = document.createElement("p");
  precipitation.innerText = `Precipitação: ${getPrecipitation(el)}`;

  let moonPhaseElement = document.createElement("p");
  moonPhaseElement.innerText = `Fase da Lua: ${moonPhase}`;

  let map = document.querySelector("#gmap_canvas");
  map.src = `https://maps.google.com/maps?q=${el.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  box.append(name, date, icon, temp, max, min, description, humidity, wind, clouds, precipitation, moonPhaseElement);
  document.querySelector("#container").append(box);
}

function getPrecipitation(el) {
  if (el.rain) {
    return `${el.rain["1h"]}mm`;
  } else if (el.snow) {
    return `${el.snow["1h"]}mm`;
  } else {
    return "Nenhuma";
  }
}

function getMoonPhase(lat, lon) {
  const url = (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=93GZ56W9GSFFAWVQCCP688L8T&include=days&elements=datetime,moonphase`);

  return fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      if (res.days && res.days.length > 0 && res.days[0].moonphase !== undefined) {
        const moonPhaseValue = res.days[0].moonphase;
        const moonPhaseName = getMoonPhaseName(moonPhaseValue);
        return moonPhaseName;
      } else {
        throw new Error('Error getting moon phase data');
      }
    })
    .catch(function(err) {
      console.error('Error:', err);
      return 'Indisponível';
    });
}

function getMoonPhaseName(moonPhaseValue) {
  if (moonPhaseValue === 0 || moonPhaseValue === 1) {
    return 'Lua Nova';
  } else if (moonPhaseValue > 0 && moonPhaseValue < 0.25) {
    return 'Crescente';
  } else if (moonPhaseValue === 0.25) {
    return 'Quarto Crescente';
  } else if (moonPhaseValue > 0.25 && moonPhaseValue < 0.5) {
    return 'Crescente Gibosa';
  } else if (moonPhaseValue === 0.5) {
    return 'Lua Cheia';
  } else if (moonPhaseValue > 0.5 && moonPhaseValue < 0.75) {
    return 'Minguante Gibosa';
  } else if (moonPhaseValue === 0.75) {
    return 'Quarto Minguante';
  } else if (moonPhaseValue > 0.75 && moonPhaseValue < 1) {
    return 'Minguante';
  } else {
    return 'Indisponível';
  }
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(success);

  function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    getLocation(crd.latitude, crd.longitude);
  }
}

function getLocation(lat, lon) {
  const url = (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8b829cb8dbb712898c23f08fd4a4b603&lang=pt_br`);

  fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      if (res.cod !== 200) {
        error1(res);
      } else {
        console.log(res);
        getMoonPhase(res.coord.lat,res.coord.lon).then(moonPhase => {
          show(res, moonPhase);
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}
