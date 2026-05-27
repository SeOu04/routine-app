import { useState, useEffect } from 'react'

const API_KEY = '204f4b347e54e41e74b77c6e465a2ca0'

const TIPS = {
  '01d': 'Perfect for a morning walk!',
  '01n': 'Clear night, sleep well!',
  '02d': 'Nice weather today!',
  '02n': 'Calm night ahead.',
  '03d': 'Cloudy but fine.',
  '03n': 'Cloudy night.',
  '04d': 'Stay focused indoors.',
  '04n': 'Cozy night in.',
  '09d': 'Indoor routine day!',
  '09n': 'Rainy night, rest up.',
  '10d': 'Bring an umbrella!',
  '10n': 'Rainy night ahead.',
  '11d': 'Storm alert, stay safe!',
  '11n': 'Storm tonight.',
  '13d': 'Snowy day!',
  '13n': 'Snowy night.',
  '50d': 'Foggy morning.',
  '50n': 'Foggy night.',
}

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchByCity('Yokohama')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchByCoords(latitude, longitude)
      },
      () => {
        fetchByCity('Yokohama')
      }
    )
  }, [])

  function fetchByCoords(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`
    )
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  function fetchByCity(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`
    )
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  if (loading) return (
    <div className="weather-card">
      <div className="weather-loading">Getting your location...</div>
    </div>
  )

  if (error || !weather || !weather.main) return null

  const temp = Math.round(weather.main.temp)
  const desc = weather.weather[0].description
  const humidity = weather.main.humidity
  const wind = Math.round(weather.wind.speed)
  const icon = weather.weather[0].icon
  const city = weather.name
  const tip = TIPS[icon] || 'Have a great day!'

  return (
    <div className="weather-card">
      <div className="weather-left">
        <div className="weather-loc">📍 {city}</div>
        <div className="weather-temp">{temp}°C</div>
        <div className="weather-desc">{desc}</div>
        <div className="weather-sub">Humidity {humidity}% · Wind {wind}m/s</div>
      </div>
      <div className="weather-right">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={desc}
          className="weather-icon"
        />
        <div className="weather-tip">{tip}</div>
      </div>
    </div>
  )
}