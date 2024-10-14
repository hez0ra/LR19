document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '8643e5fa4d67cb1ad3c160e1d6c66d90';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Город не найден');
            }
            return response.json();
        })
        .then(data => {
            const weatherInfo = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                precipitation: data.rain ? data.rain['1h'] : 0,
                windSpeed: data.wind.speed,
                windDirection: getWindDirection(data.wind.deg),
                icon: data.weather[0].icon
            };
            displayWeather(weatherInfo, city);
            displayRecommendations(weatherInfo);
        })
        .catch(error => {
            alert(error.message);
        });
});

function displayWeather(info, city) {
    const container = document.getElementById('weatherTableContainer');
    container.innerHTML = `
        <h2>Погода в ${city}</h2>
        <table>
            <tr>
                <th>Температура (°C)</th>
                <th>Влажность (%)</th>
                <th>Осадки (мм)</th>
                <th>Скорость ветра (м/с)</th>
                <th>Направление ветра</th>
                <th>Иконка погоды</th>
            </tr>
            <tr>
                <td>${info.temperature}</td>
                <td>${info.humidity}</td>
                <td>${info.precipitation}</td>
                <td>${info.windSpeed}</td>
                <td>${info.windDirection}</td>
                <td><img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" alt="Погода" /></td>
            </tr>
        </table>
    `;
}

function getWindDirection(deg) {
    if (deg >= 0 && deg < 22.5) return "Север";
    if (deg >= 22.5 && deg < 67.5) return "Северо-восток";
    if (deg >= 67.5 && deg < 112.5) return "Восток";
    if (deg >= 112.5 && deg < 157.5) return "Юго-восток";
    if (deg >= 157.5 && deg < 202.5) return "Юг";
    if (deg >= 202.5 && deg < 247.5) return "Юго-запад";
    if (deg >= 247.5 && deg < 292.5) return "Запад";
    if (deg >= 292.5 && deg < 337.5) return "Северо-запад";
    return "Север"; // Если угол равен 360 или близок к нулю
}

function displayRecommendations(info) {
    const recommendationContainer = document.getElementById('recommendationContainer');
    let recommendations = "Рекомендации: ";

    // Рекомендации по температуре
    if (info.temperature > 30) {
        recommendations += "Очень жарко! Пейте много воды и оставайтесь в тени. ";
    } else if (info.temperature > 20) {
        recommendations += "Комфортная температура. Можно гулять на улице. ";
    } else if (info.temperature > 10) {
        recommendations += "Немного прохладно. Наденьте легкую куртку. ";
    } else {
        recommendations += "Холодно! Убедитесь, что вы тепло одеты. ";
    }

    // Рекомендации по осадкам
    if (info.precipitation > 0) {
        recommendations += "Не забудьте взять зонт! ";
    }

    // Рекомендации по ветру
    if (info.windSpeed > 15) {
        recommendations += "Сильный ветер! Будьте осторожны на улице. ";
    }

    recommendationContainer.innerHTML = recommendations;
}